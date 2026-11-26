import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Order from '../../../models/Order';
import PromoCode from '../../../models/PromoCode';

export async function GET(request: Request) {
// ... existing get code ...
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    await connectToDatabase();
    
    let query: any = {};
    if (email) {
      query = { email: email };
    } else if (phone) {
      // Extract only the numbers
      const cleanPhone = phone.replace(/\D/g, '');
      // Get the last 10 digits (ignoring country codes like +91)
      const last10 = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;
      
      if (last10) {
        // Find any order where the phone number contains these 10 digits
        query = { phone: { $regex: last10 } };
      } else {
        query = { phone: phone };
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, email, phone, address, city, pincode, items, totalAmount, promoCode } = body;

    if (!customerName || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    
    const newOrder = await Order.create({
      customerName,
      email: email || "N/A",
      phone,
      address,
      city,
      pincode,
      items,
      totalAmount,
      promoCode,
      status: "Pending"
    });

    if (promoCode) {
      await PromoCode.findOneAndUpdate(
        { code: promoCode },
        { $inc: { usageCount: 1 } }
      );
    }

    // ==========================================
    // 📧 AUTOMATED EMAIL RECEIPT & ADMIN NOTIFICATION
    // ==========================================
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Generate Item Rows for HTML
      const itemsHtml = items.map((item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; width: 60px;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">
            <strong>${item.name}</strong><br/>
            Qty: ${item.quantity}
            ${item.customization?.text ? `<br/><span style="color: #8b5a2b; font-size: 0.9em; font-weight: bold; background: #faf5ee; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px;">✒️ Engraving: "${item.customization.text}" (${item.customization.font || 'Royal Calligraphy'})</span>` : ''}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">
            ₹${item.price * item.quantity}
          </td>
        </tr>
      `).join('');

      // 1. Send Admin Alert Email (Always)
      const adminMailOptions = {
        from: '"Kaashta System" <' + process.env.EMAIL_USER + '>',
        to: 'kaashtacrafts@gmail.com',
        subject: `🚨 NEW ORDER: ₹${totalAmount} from ${customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #8b5a2b; border-radius: 8px;">
            <h2 style="color: #8b5a2b; margin-top: 0;">New Order Alert! 🎉</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email || "Not provided"}</p>
            
            <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Items Ordered (ID: ${newOrder._id})</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${itemsHtml}
            </table>
            <h3 style="color: #d97706;">Total Amount: ₹${totalAmount}</h3>
            
            <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Shipping Address</h3>
            <p style="margin: 0;">${address}</p>
            <p style="margin: 0;">${city} - ${pincode}</p>
          </div>
        `
      };
      await transporter.sendMail(adminMailOptions);
      console.log(`[EMAIL SUCCESS] Admin Alert sent to kaashtacrafts@gmail.com`);

      // 2. Send Customer Receipt Email (If email is provided)
      if (email && email !== "N/A") {
        const mailOptions = {
          from: '"Kaashta Crafts" <' + process.env.EMAIL_USER + '>',
          to: email,
          subject: `Order Confirmation - #${newOrder._id}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <div style="background-color: #f8f3ec; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #8b5a2b; margin: 0;">Kaashta Crafts</h1>
                <p style="margin-top: 5px; color: #666;">Thank you for your order!</p>
              </div>
              <div style="padding: 20px; border: 1px solid #f8f3ec; border-top: none;">
                <h2>Order Confirmed</h2>
                <p>Hi <strong>${customerName}</strong>,</p>
                <p>We have successfully received your order. We will process it shortly and notify you once it ships.</p>
                
                <h3 style="border-bottom: 2px solid #f8f3ec; padding-bottom: 5px;">Order Summary (ID: ${newOrder._id})</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  ${itemsHtml}
                  <tr>
                    <td style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                    <td style="padding: 10px; text-align: right; font-size: 1.1em; color: #8b5a2b;"><strong>₹${totalAmount}</strong></td>
                  </tr>
                </table>

                <h3 style="border-bottom: 2px solid #f8f3ec; padding-bottom: 5px;">Shipping Details</h3>
                <p>
                  <strong>Address:</strong><br/>
                  ${address}, ${city} - ${pincode}<br/>
                  <strong>Phone:</strong> ${phone}
                </p>
                
                <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; text-align: center; border-radius: 4px;">
                  <p style="margin: 0; font-size: 0.9em; color: #777;">If you have any questions, reply to this email.</p>
                </div>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Order Confirmation sent to ${email}`);
      }
    } catch (emailError) {
      console.error("Failed to send order emails:", emailError);
      // We don't fail the order if the emails fail
    }

    // ==========================================
    // 💬 WHATSAPP ORDER NOTIFICATION (+91 8838098116)
    // ==========================================
    const itemsSummary = items
      .map((item: any, idx: number) => {
        let line = `${idx + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`;
        if (item.customization?.text) {
          line += `\n   ✒️ *Custom Engraving:* "${item.customization.text}" (${item.customization.font || "Royal Calligraphy"})`;
        }
        return line;
      })
      .join('\n');

    const whatsappMessage = 
`🛍️ *NEW ORDER - KAASHTA CRAFTS*
━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* #${newOrder._id.toString().slice(-6).toUpperCase()}
👤 *Customer:* ${customerName}
📞 *Phone:* ${phone}
✉️ *Email:* ${email || "N/A"}
📍 *Delivery Address:*
${address}, ${city} - ${pincode}

🛒 *Items Ordered:*
${itemsSummary}

💰 *Total Price:* ₹${totalAmount}
${promoCode ? `🏷️ *Promo Code:* ${promoCode}\n` : ''}━━━━━━━━━━━━━━━━━━━━
🔗 *View in Admin Panel:*
https://kaashtacrafts.vercel.app/admin`;

    const targetNumber = "918838098116";
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({ success: true, order: newOrder, whatsappUrl });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
