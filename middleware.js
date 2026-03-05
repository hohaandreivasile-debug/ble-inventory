export const config = {
  // Acest matcher aplică protecția pe toate fișierele din site
  matcher: '/(.*)', 
};

export default function middleware(request) {
  const basicAuth = request.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // 👇 Aici codul "citește" variabilele pe care tocmai le-ai setat în Vercel
    const validUser = process.env.AUTH_USER;
    const validPass = process.env.AUTH_PASS;

    if (user === validUser && pwd === validPass) {
      // Dacă datele se potrivesc, lasă utilizatorul să vadă site-ul
      return new Response(null, { headers: { 'x-middleware-next': '1' } });
    }
  }

  // Dacă datele sunt greșite sau lipsesc, afișează pop-up-ul
  return new Response('Acces restricționat. Te rog să introduci parola.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Zona Securizata"',
    },
  });
}
