# API-project

Git repo je potrebno samo klonirati ili skinuti, otvoriti terminal sa folderom APIproject, ukucati komandu npm install za instaliranje potrebnih paketa  i npm start za pokretanje server.

Svrha i objasnjenje projekta

Na početku server.js file-a uvode se potrebni moduli i biblioteke. Ovdje je kratko objašnjenje svakog uvezenog modula:
•	express: Uvozi se Express.js, popularan web okvir za Node.js, koji se koristi za izgradnju web aplikacija.
•	axios: Uvozi se Axios, biblioteka za izvršavanje HTTP zahtjeva. Koristit ćemo je za slanje zahtjeva prema Weatherbit API-ju.
•	NodeCache: Uvozi se NodeCache, biblioteka za spremanje podataka u keš memoriju. Keširanje će nam omogućiti da pohranimo privremene podatke i izbjegnemo nepotrebne zahtjeve prema Weatherbit API-ju.
•	basicAuth: Uvozi se basicAuth, biblioteka koja omogućava osnovnu provjeru autentičnosti (basic authentication). Koristit ćemo je za zaštitu naših API endpointa s korisničkim imenima i siframa.
•	fs: Uvozi se fs, ugrađeni Node.js modul za rad s datotekama. Koristit ćemo ga za čitanje korisničkih podataka iz JSON datoteke.
Definira se konstanta apiKey koja sadrži API ključ za Weatherbit API. Ovaj ključ će se koristiti za autentikaciju pri slanju zahtjeva prema API-ju. Važno je imati valjan API ključ kako bi API zahtjevi bili uspješni.
Kreira se instanca NodeCache objekta nazvana cache. Konstruktor NodeCache prima opcionalne parametre, a mi postavljamo stdTTL na 300, što znači da će podaci biti pohranjeni u kešu 300 sekundi (5 minuta). Ovo vremensko ograničenje određuje koliko će dugo podaci ostati u kešu prije nego što se izbrišu i ažuriraju novim podacima.
Kreira se instanca Express.js aplikacije nazvana app pomoću express() funkcije. Ova instanca predstavlja naš HTTP server koji će obrađivati zahtjeve.
Definira se middleware funkcija basicAuth koja se koristi za provjeru osnovne autentikacije korisnika. Ova funkcija uzima dva parametra: username i password. U tijelu funkcije čitamo korisničke podatke iz JSON datoteke users.json pomoću fs.readFileSync metode.
Definira se ruta GET /weather/current koja će obrađivati zahtjeve za dohvaćanje trenutnih vremenskih podataka. Koristimo async/await sintaksu kako bismo izvršili asinhroni kod. U okviru ove rute, prvo provjeravamo postoji li location u zahtjevu (preko req.query.location). Ako location nije prisutan, vraćamo grešku s HTTP statusom 400 i odgovarajućom porukom.
Zatim kreiramo cacheKey koristeći location, koji je oblik "current:{location}". Nakon toga, provjeravamo ima li podataka za taj cacheKey u kešu pomoću cache.get metode. Ako postoje keširani podaci, vraćamo ih kao odgovor s dodatnim svojstvom cached postavljenim na true.
Ako nema keširanih podataka, šaljemo zahtjev prema Weatherbit API-ju pomoću axios.get metode. Dobijeni odgovor pohranjujemo u varijablu response. Zatim iz response.data izvlačimo vremenske podatke i pohranjujemo ih u keš pomoću cache.set metode. Kao odgovor šaljemo dobivene vremenske podatke s dodatnim svojstvima cached: false, lastRefreshed koji sadrži trenutno vrijeme i provider koji označava da su podaci dobiveni putem Weatherbit.io API-ja.
Ako se tijekom zahtjeva dogodi pogreška (npr. problem s mrežom, neispravan API ključ itd.), hvatamo pogrešku pomoću try/catch bloka. U slučaju pogreške, ispisujemo pogrešku u konzolu i vraćamo odgovarajući HTTP status 500 s porukom greške.
Slično kao kod prethodne rute, definiraju se rute GET /weather/forecast i GET /weather/history za dohvaćanje vremenske prognoze i povijesnih vremenskih podataka. Ove rute također provjeravaju prisutnost potrebnih parametara (location, start_date, end_date) i obrađuju odgovarajuće zahtjeve prema Weatherbit API-ju.
Na kraju, aplikacija sluša na portu 3000 pomoću app.listen metode. Kada server bude pokrenut, ispisuje se poruka "Server is running on port 3000" u konzoli. 
Ovaj kod omogućava izgradnju jednostavne Express.js aplikacije koja pruža API endpointe za dohvaćanje vremenskih podataka. Podaci se pohranjuju u keš kako bi se smanjio broj zahtjeva prema Weatherbit API-ju i poboljšala brzina odgovora. Također, osigurava se osnovna autentikacija za pristup API endpointima.
