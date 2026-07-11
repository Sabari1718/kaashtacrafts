import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    
    // In a real production app, these should be in .env.local
    // For now, we will use a fallback so it works immediately for the user
    const validUser = process.env.ADMIN_USERNAME || 'sabari';
    const validPass = process.env.ADMIN_PASSWORD || 'mani@1718';
    
    if (username === validUser && password === validPass) {
      // Return a simple success token. 
      // For higher security, this would be a JWT stored in an HTTP-only cookie.
      return NextResponse.json({ 
        success: true, 
        token: 'kaashtacrafts-admin-secure-token-2026' 
      });
    }
    
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
