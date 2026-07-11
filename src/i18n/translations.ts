export type Lang = "sl" | "en";

export interface Translation {
  meta: { title: string; description: string };
  nav: {
    howItWorks: string;
    results: string;
    pricing: string;
    shop: string;
    faq: string;
    cta: string;
  };
  hero: {
    h1: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaNote: string;
    visualBiz: string;
    visualSms: string;
    visualBefore: string;
    visualAfter: string;
    visualBeforeLabel: string;
    visualAfterLabel: string;
  };
  trust: { items: string[] };
  problem: {
    h2: string;
    subtitle: string;
    cards: { title: string; text: string }[];
  };
  change: {
    h2: string;
    points: { title: string; text: string }[];
  };
  caseStudy: {
    eyebrow: string;
    h2: string;
    context: string;
    result: string;
    beforeLabel: string;
    afterLabel: string;
    pending: string;
  };
  how: {
    h2: string;
    steps: { num: string; title: string; text: string }[];
  };
  firstWeek: {
    h2: string;
    items: { day: string; text: string }[];
  };
  cards: {
    h2: string;
    subtitle: string;
    colCard: string;
    colRevju: string;
    rows: { label: string; card: string; revju: string }[];
    closing: string;
  };
  forWho: {
    h2: string;
    items: string[];
    closing: string;
  };
  pricing: {
    h2: string;
    subtitle: string;
    perMonth: string;
    popular: string;
    plansIncluded: string;
    plans: {
      name: string;
      price: string;
      tagline: string;
      popular?: boolean;
      features: string[];
      cta: string;
    }[];
    below: string;
  };
  shop: {
    h2: string;
    subtitle: string;
    priceTbd: string;
    buy: string;
    products: { name: string; desc: string }[];
    delivery: string;
    cross: string;
    crossLink: string;
  };
  faq: {
    h2: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    h2: string;
    subtitle: string;
    cta: string;
  };
  booking: {
    title: string;
    subtitle: string;
    name: string;
    business: string;
    phone: string;
    profile: string;
    submit: string;
    note: string;
  };
  footer: {
    desc: string;
    linksTitle: string;
    links: { label: string; href: string }[];
    legalTitle: string;
    legal: { label: string; href: string }[];
    companyTitle: string;
    companyPending: string;
    rights: string;
    madeIn: string;
  };
}

export const translations: Record<Lang, Translation> = {
  sl: {
    meta: {
      title: "Revju — Več strank, brez dodatnega dela | Google ocene za lokalna podjetja",
      description:
        "Revju po vsakem terminu samodejno pošlje SMS vaši stranki in jo prosi za Google oceno. Vi ne naredite nič. Več ocen, višje na Googlu, več strank. Brez vzpostavitvenega stroška.",
    },
    nav: {
      howItWorks: "Kako deluje",
      results: "Rezultati",
      pricing: "Cenik",
      shop: "Trgovina",
      faq: "Pogosta vprašanja",
      cta: "Rezerviraj klic",
    },
    hero: {
      h1: "Več strank. Brez dodatnega dela.",
      subtitle:
        "Revju po vsakem terminu samodejno pošlje SMS vaši stranki in jo prosi za Google oceno. Vi ne naredite ničesar. Google vas začne kazati višje — telefon začne zvoniti.",
      ctaPrimary: "Rezerviraj brezplačen klic",
      ctaSecondary: "Poglej rezultate",
      ctaNote: "Brez vzpostavitvenega stroška. Brez vezave.",
      visualBiz: "Kozmetični salon Maja",
      visualSms: "Hvala za obisk! Nam pustite oceno? ⭐",
      visualBefore: "9",
      visualAfter: "74",
      visualBeforeLabel: "prej",
      visualAfterLabel: "čez 3 mesece",
    },
    trust: {
      items: [
        "Prvi rezultati v 48 urah",
        "Brez vezave — prekinete kadarkoli",
        "Vse skladno z GDPR",
      ],
    },
    problem: {
      h2: "Vaša konkurenca ni boljša od vas.",
      subtitle: "Ima samo več ocen. In stranke tega ne znajo ločiti.",
      cards: [
        {
          title: "Stranke vas ne najdejo",
          text: "Nekdo v vašem mestu prav zdaj išče točno to, kar ponujate. Google mu pokaže tri podjetja. Vi niste med njimi — ne zato, ker ste slabši, ampak ker imate 9 ocen namesto 70.",
        },
        {
          title: "Nimate časa prositi",
          text: "Vsakič, ko stranka odide zadovoljna, izgubite oceno, ki bi jo lahko imeli. Vi delate. Nimate časa loviti ljudi po telefonu.",
        },
        {
          title: "Zaposleni pozabijo",
          text: "Rekli ste jim, naj vprašajo. Prvi teden so. Potem se je nehalo. Vsak sistem, ki je odvisen od tega, da se nekdo spomni, prej ali slej odpove.",
        },
      ],
    },
    change: {
      h2: "Kaj se zgodi, ko imate 70 ocen namesto 9",
      points: [
        {
          title: "Vas najdejo prve.",
          text: "Google postavi podjetja z več ocenami višje. Višje = več klicev.",
        },
        {
          title: "Ne rabite se več dokazovati.",
          text: "Nova stranka prebere 40 zadovoljnih ljudi in vas pokliče. Brez pregovarjanja.",
        },
        {
          title: "Zaračunate lahko več.",
          text: "Podjetje s 4,9 ★ in 70 ocenami ni v isti ligi kot tisto z 9. Cena sledi.",
        },
        {
          title: "Deluje naprej.",
          text: "Vsak nov termin = nova ocena. Samodejno, vsak dan.",
        },
      ],
    },
    caseStudy: {
      eyebrow: "Kozmetični salon · Slovenija",
      h2: "3 → 20 ocen v enem tednu",
      context:
        "Viktorija je imela tri ocene. Salon je delal odlično — stranke so se vračale — ampak na Googlu je bila nevidna. Priklopili smo Revju na njen rezervacijski sistem in poslali sporočilo vsem strankam iz zadnjih mesecev. V sedmih dneh: 20 ocen.",
      result: "V 7 dneh",
      beforeLabel: "prej",
      afterLabel: "čez teden dni",
      pending: "Screenshot in izjava stranke — v pripravi",
    },
    how: {
      h2: "Trije koraki. Potem nikoli več ne razmišljate o tem.",
      steps: [
        {
          num: "01",
          title: "Povemo si 15 minut",
          text: "Pokličeva se. Pogledava vaš Google profil in vaš rezervacijski sistem. Povem vam, koliko ocen lahko realno pričakujete v prvem mesecu.",
        },
        {
          num: "02",
          title: "Vse nastavimo mi",
          text: "Priklopimo se na vaš sistem (Fresha, Booksy, Excel — karkoli imate). Napišemo sporočilo v vašem tonu. Vi ne naredite nič.",
        },
        {
          num: "03",
          title: "Sistem teče",
          text: "Vsaka stranka po terminu dobi sporočilo. Ocene začnejo prihajati. Vi vidite številko, ki raste.",
        },
      ],
    },
    firstWeek: {
      h2: "Kaj se zgodi v prvem tednu",
      items: [
        {
          day: "Danes",
          text: "Rezervirate klic. V 15 minutah veva, ali je za vas smiselno.",
        },
        {
          day: "2. dan",
          text: "Sistem je priklopljen. Prva sporočila gredo v vašo obstoječo bazo strank.",
        },
        {
          day: "3. dan",
          text: "Prve ocene se pojavijo na vašem Google profilu.",
        },
        {
          day: "7. dan",
          text: "Številka je vidno višja. Google to opazi. Vi niste naredili ničesar.",
        },
      ],
    },
    cards: {
      h2: "Kartice ste že poskusili. Ali pa jih boste.",
      subtitle: "Tu je, zakaj se vedno konča enako.",
      colCard: "NFC kartica sama",
      colRevju: "Revju",
      rows: [
        {
          label: "Kdo prosi za oceno",
          card: "Zaposleni — če se spomni",
          revju: "Sistem — vsakič",
        },
        {
          label: "Kaj se zgodi v napornem dnevu",
          card: "Nihče ne ponudi kartice",
          revju: "Sporočilo gre vseeno",
        },
        {
          label: "Stare stranke",
          card: "Ne dosežete jih",
          revju: "Vse dosežete v prvem tednu",
        },
        {
          label: "Ko se zaposleni zamenja",
          card: "Začnete znova",
          revju: "Nič se ne spremeni",
        },
        {
          label: "Koliko dela za vas",
          card: "Vsak dan malo",
          revju: "Enkrat, na začetku",
        },
      ],
      closing:
        "Kartica je dober pripomoček. Ni sistem. Zato jo v paketu Rast dobite zraven — ampak delo opravi avtomatizacija.",
    },
    forWho: {
      h2: "Za katera podjetja to deluje",
      items: [
        "Kozmetični saloni",
        "Frizerski saloni",
        "Zobozdravstvo",
        "Avtoservisi",
        "Fizioterapija",
        "Gostinstvo",
        "Vulkanizerji",
        "Masaže",
        "Nohti",
        "Tetoviranje",
        "Veterina",
        "Servisi",
      ],
      closing:
        "Če imate stranke, ki pridejo, odidejo zadovoljne in nikoli ne napišejo ocene — deluje za vas.",
    },
    pricing: {
      h2: "Dva paketa. Brez vzpostavitvenega stroška.",
      subtitle: "Konkurenca zaračuna 45–118 € samo za začetek. Mi ne.",
      perMonth: "/ mesec",
      popular: "Najbolj priljubljen",
      plansIncluded: "Vse iz paketa Start, plus:",
      plans: [
        {
          name: "Revju Start",
          price: "49 €",
          tagline:
            "Za manjše salone in obrti, ki hočejo, da ocene končno začnejo prihajati.",
          features: [
            "Avtomatski SMS po vsakem terminu",
            "Do 150 sporočil na mesec",
            "Personalizirano sporočilo z imenom stranke",
            "Mesečno poročilo — koliko ocen, koliko novih",
            "Brez vezave, prekinete kadarkoli",
            "Vzpostavitev: 0 €",
          ],
          cta: "Začni s Start",
        },
        {
          name: "Revju Rast",
          price: "99 €",
          tagline:
            "Za podjetja, ki hočejo val ocen takoj in nočejo o tem več razmišljati.",
          popular: true,
          features: [
            "Do 500 sporočil na mesec",
            "Reaktivacija baze — pošljemo vsem vašim starim strankam. Val ocen v prvem tednu.",
            "Odgovarjamo na ocene namesto vas",
            "Najboljše ocene objavimo na vaš Instagram",
            "NFC stojalo + 10 kartic vključeno",
            "Vzpostavitev: 0 €",
          ],
          cta: "Začni z Rast",
        },
      ],
      below:
        "Niste prepričani? Rezervirajte 15-minutni klic. Povem vam, koliko ocen lahko realno pričakujete — in če se vam ne splača, vam to povem.",
    },
    shop: {
      h2: "Fizični pripomočki",
      subtitle:
        "Za podjetja, ki hočejo možnost ocene ponuditi tudi na pultu.",
      priceTbd: "Cena kmalu",
      buy: "Kupi",
      products: [
        {
          name: "NFC stojalo",
          desc: "Stoji na pultu. Stranka prisloni telefon. Odpre se vaša Google ocena.",
        },
        {
          name: "NFC kartice (10 kom)",
          desc: "Potiskane z vašim logotipom. NFC + QR koda.",
        },
      ],
      delivery: "Dostava po Sloveniji",
      cross: "V paketu Rast dobite stojalo in kartice brezplačno.",
      crossLink: "Poglej pakete",
    },
    faq: {
      h2: "Pogosta vprašanja",
      items: [
        {
          q: "Ali je to skladno z Googlovimi pravili?",
          a: "Da. Ne ponujamo nagrad za ocene. Ne usmerjamo strank, kakšno oceno naj pustijo. Ne filtriramo nezadovoljnih. Samo olajšamo postopek zadovoljnim strankam, ki bi oceno pustile — če bi se spomnile. To je natanko to, kar Google priporoča.",
        },
        {
          q: "Ali je SMS nadlegovanje strank?",
          a: "Eno sporočilo po opravljeni storitvi ni nadlegovanje. To je isto vprašanje, ki bi ga zastavila vaša zaposlena — samo da se zgodi vsakič, ne enkrat na teden, ko se kdo spomni. Sporočila pošiljamo enkrat po terminu, z največ enim opomnikom. Nikoli ne pošiljamo strankam, ki so oceno že pustile.",
        },
        {
          q: "Kaj pa če kdo pusti slabo oceno?",
          a: "Statistično je nezadovoljna stranka veliko bolj verjetno napisala oceno kot zadovoljna — zato ima večina podjetij nesorazmerno slab profil. Ko začnete sistematično prositi vse stranke, se povprečje dvigne, ker je večina zadovoljnih. Slabe ocene se ne izognemo, ampak jo utopimo v resnici.",
        },
        {
          q: "Ali moram nameščati aplikacijo?",
          a: "Ne. Ne vi, ne vaše stranke. Mi vse nastavimo, vi ne naredite ničesar.",
        },
        {
          q: "Kaj če nimam rezervacijskega sistema?",
          a: "Ni problema. Delamo z Excel datoteko, s seznamom v telefonu, ali pa vam pomagamo urediti osnovni sistem.",
        },
        {
          q: "Koliko časa traja vzpostavitev?",
          a: "En dan. Klic traja 15 minut, potem naredimo vse mi.",
        },
        {
          q: "Kdaj vidim prve ocene?",
          a: "Prve v 48 urah. Če ste na paketu Rast in reaktiviramo staro bazo — val v prvem tednu.",
        },
        {
          q: "Ali sem vezan na pogodbo?",
          a: "Ne. Prekinete kadarkoli, brez razloga in brez stroška.",
        },
        {
          q: "Kaj se zgodi z mojimi podatki o strankah?",
          a: "Ostanejo vaši. Uporabimo jih izključno za pošiljanje sporočila. Ne prodajamo jih, ne delimo, ne uporabljamo za nič drugega. Vse skladno z GDPR.",
        },
        {
          q: "Koliko ocen lahko realno pričakujem?",
          a: "Odvisno od števila strank. Salon s 100 strankami na mesec dobi tipično 15–30 novih ocen v prvem mesecu. Na klicu vam povem konkretno številko za vaš primer.",
        },
      ],
    },
    finalCta: {
      h2: "Vaše stranke so zadovoljne. Google tega ne ve.",
      subtitle:
        "15-minutni klic. Povem vam, koliko ocen lahko pričakujete — in če se vam ne splača, vam to povem.",
      cta: "Rezerviraj brezplačen klic",
    },
    booking: {
      title: "Rezervirajte brezplačen klic",
      subtitle: "Pustite podatke in pokličemo vas v enem delovnem dnevu.",
      name: "Ime in priimek",
      business: "Ime podjetja",
      phone: "Telefonska številka",
      profile: "Povezava do vašega Google profila (neobvezno)",
      submit: "Pošlji povpraševanje",
      note: "Z oddajo se strinjate, da vas kontaktiramo glede storitve Revju.",
    },
    footer: {
      desc: "Revju po vsakem terminu samodejno pošlje SMS vaši stranki in jo prosi za Google oceno. Vi ne naredite ničesar.",
      linksTitle: "Povezave",
      links: [
        { label: "Kako deluje", href: "#kako-deluje" },
        { label: "Cenik", href: "#cenik" },
        { label: "Trgovina", href: "#trgovina" },
        { label: "Kontakt", href: "#rezervacija" },
      ],
      legalTitle: "Pravno",
      legal: [
        { label: "Politika zasebnosti", href: "#zasebnost" },
        { label: "Splošni pogoji", href: "#pogoji" },
      ],
      companyTitle: "Podjetje",
      companyPending: "Podatki podjetja — v pripravi",
      rights: "Vse pravice pridržane.",
      madeIn: "Slovenija",
    },
  },
  en: {
    meta: {
      title: "Revju — More customers, no extra work | Google reviews for local business",
      description:
        "After every appointment Revju automatically texts your customer and asks for a Google review. You do nothing. More reviews, higher on Google, more customers. No setup fee.",
    },
    nav: {
      howItWorks: "How it works",
      results: "Results",
      pricing: "Pricing",
      shop: "Shop",
      faq: "FAQ",
      cta: "Book a call",
    },
    hero: {
      h1: "More customers. No extra work.",
      subtitle:
        "After every appointment Revju automatically sends your customer a text asking for a Google review. You do nothing. Google starts ranking you higher — the phone starts ringing.",
      ctaPrimary: "Book a free call",
      ctaSecondary: "See the results",
      ctaNote: "No setup fee. No contract.",
      visualBiz: "Maja Beauty Salon",
      visualSms: "Thanks for visiting! Leave us a review? ⭐",
      visualBefore: "9",
      visualAfter: "74",
      visualBeforeLabel: "before",
      visualAfterLabel: "after 3 months",
    },
    trust: {
      items: [
        "First results within 48 hours",
        "No contract — cancel anytime",
        "Fully GDPR compliant",
      ],
    },
    problem: {
      h2: "Your competition isn't better than you.",
      subtitle: "They just have more reviews. And customers can't tell the difference.",
      cards: [
        {
          title: "Customers can't find you",
          text: "Someone in your town is searching for exactly what you offer right now. Google shows them three businesses. You're not one of them — not because you're worse, but because you have 9 reviews instead of 70.",
        },
        {
          title: "You have no time to ask",
          text: "Every time a happy customer leaves, you lose a review you could have had. You're working. You don't have time to chase people by phone.",
        },
        {
          title: "Staff forget",
          text: "You told them to ask. They did the first week. Then it stopped. Any system that depends on someone remembering will eventually fail.",
        },
      ],
    },
    change: {
      h2: "What happens when you have 70 reviews instead of 9",
      points: [
        {
          title: "You get found first.",
          text: "Google ranks businesses with more reviews higher. Higher = more calls.",
        },
        {
          title: "You stop having to prove yourself.",
          text: "A new customer reads 40 happy people and calls you. No convincing needed.",
        },
        {
          title: "You can charge more.",
          text: "A business with 4.9 ★ and 70 reviews isn't in the same league as one with 9. Price follows.",
        },
        {
          title: "It keeps working.",
          text: "Every new appointment = a new review. Automatically, every day.",
        },
      ],
    },
    caseStudy: {
      eyebrow: "Beauty salon · Slovenia",
      h2: "3 → 20 reviews in one week",
      context:
        "Viktorija had three reviews. The salon was doing great — customers kept coming back — but on Google she was invisible. We connected Revju to her booking system and messaged every customer from the last few months. Within seven days: 20 reviews.",
      result: "In 7 days",
      beforeLabel: "before",
      afterLabel: "one week later",
      pending: "Screenshot and customer quote — coming soon",
    },
    how: {
      h2: "Three steps. Then you never think about it again.",
      steps: [
        {
          num: "01",
          title: "We talk for 15 minutes",
          text: "We hop on a call. We look at your Google profile and your booking system. I tell you how many reviews you can realistically expect in the first month.",
        },
        {
          num: "02",
          title: "We set it all up",
          text: "We connect to your system (Fresha, Booksy, Excel — whatever you have). We write the message in your tone. You do nothing.",
        },
        {
          num: "03",
          title: "The system runs",
          text: "Every customer gets a message after their appointment. Reviews start coming in. You watch the number grow.",
        },
      ],
    },
    firstWeek: {
      h2: "What happens in the first week",
      items: [
        {
          day: "Today",
          text: "You book a call. In 15 minutes we know whether it makes sense for you.",
        },
        {
          day: "Day 2",
          text: "The system is connected. The first messages go out to your existing customer base.",
        },
        {
          day: "Day 3",
          text: "The first reviews appear on your Google profile.",
        },
        {
          day: "Day 7",
          text: "The number is visibly higher. Google notices. You did nothing.",
        },
      ],
    },
    cards: {
      h2: "You've tried cards. Or you will.",
      subtitle: "Here's why it always ends the same way.",
      colCard: "NFC card alone",
      colRevju: "Revju",
      rows: [
        {
          label: "Who asks for the review",
          card: "The employee — if they remember",
          revju: "The system — every time",
        },
        {
          label: "What happens on a busy day",
          card: "No one offers the card",
          revju: "The message goes out anyway",
        },
        {
          label: "Old customers",
          card: "You can't reach them",
          revju: "You reach them all in week one",
        },
        {
          label: "When an employee leaves",
          card: "You start over",
          revju: "Nothing changes",
        },
        {
          label: "How much work for you",
          card: "A little every day",
          revju: "Once, at the start",
        },
      ],
      closing:
        "A card is a nice tool. It's not a system. That's why the Growth plan includes one — but the automation does the work.",
    },
    forWho: {
      h2: "Which businesses this works for",
      items: [
        "Beauty salons",
        "Hair salons",
        "Dental practices",
        "Auto repair",
        "Physiotherapy",
        "Hospitality",
        "Tyre shops",
        "Massage",
        "Nails",
        "Tattoo",
        "Veterinary",
        "Repair shops",
      ],
      closing:
        "If you have customers who come in, leave happy and never write a review — it works for you.",
    },
    pricing: {
      h2: "Two plans. No setup fee.",
      subtitle: "The competition charges €45–118 just to get started. We don't.",
      perMonth: "/ month",
      popular: "Most popular",
      plansIncluded: "Everything in Start, plus:",
      plans: [
        {
          name: "Revju Start",
          price: "€49",
          tagline:
            "For smaller salons and trades that want reviews to finally start coming in.",
          features: [
            "Automatic SMS after every appointment",
            "Up to 150 messages per month",
            "Personalised message with the customer's name",
            "Monthly report — how many reviews, how many new",
            "No contract, cancel anytime",
            "Setup: €0",
          ],
          cta: "Start with Start",
        },
        {
          name: "Revju Growth",
          price: "€99",
          tagline:
            "For businesses that want a wave of reviews now and never want to think about it again.",
          popular: true,
          features: [
            "Up to 500 messages per month",
            "Database reactivation — we message all your past customers. A wave of reviews in the first week.",
            "We reply to reviews for you",
            "We post your best reviews to your Instagram",
            "NFC stand + 10 cards included",
            "Setup: €0",
          ],
          cta: "Start with Growth",
        },
      ],
      below:
        "Not sure? Book a 15-minute call. I'll tell you how many reviews you can realistically expect — and if it's not worth it for you, I'll tell you that too.",
    },
    shop: {
      h2: "Physical add-ons",
      subtitle: "For businesses that also want to offer the review option at the counter.",
      priceTbd: "Price soon",
      buy: "Buy",
      products: [
        {
          name: "NFC stand",
          desc: "Sits on your counter. The customer taps their phone. Your Google review opens.",
        },
        {
          name: "NFC cards (10 pcs)",
          desc: "Printed with your logo. NFC + QR code.",
        },
      ],
      delivery: "Delivery across Slovenia",
      cross: "The Growth plan includes the stand and cards for free.",
      crossLink: "See the plans",
    },
    faq: {
      h2: "Frequently asked questions",
      items: [
        {
          q: "Is this compliant with Google's rules?",
          a: "Yes. We don't offer rewards for reviews. We don't steer customers on what rating to leave. We don't filter out unhappy ones. We simply make it easy for happy customers who would leave a review — if they remembered. This is exactly what Google recommends.",
        },
        {
          q: "Is texting customers harassment?",
          a: "One message after a completed service isn't harassment. It's the same question your employee would ask — it just happens every time, not once a week when someone remembers. We send once after the appointment, with at most one reminder. We never message customers who have already left a review.",
        },
        {
          q: "What if someone leaves a bad review?",
          a: "Statistically an unhappy customer is far more likely to have written a review than a happy one — which is why most businesses have a disproportionately poor profile. Once you start systematically asking all customers, the average rises, because most are happy. You don't avoid bad reviews, you drown them in the truth.",
        },
        {
          q: "Do I have to install an app?",
          a: "No. Neither you nor your customers. We set everything up, you do nothing.",
        },
        {
          q: "What if I don't have a booking system?",
          a: "No problem. We work with an Excel file, a list on your phone, or we help you set up a basic system.",
        },
        {
          q: "How long does setup take?",
          a: "One day. The call takes 15 minutes, then we do everything.",
        },
        {
          q: "When do I see the first reviews?",
          a: "The first within 48 hours. If you're on the Growth plan and we reactivate your old database — a wave in the first week.",
        },
        {
          q: "Am I tied to a contract?",
          a: "No. Cancel anytime, no reason and no cost.",
        },
        {
          q: "What happens to my customer data?",
          a: "It stays yours. We use it solely to send the message. We don't sell it, share it, or use it for anything else. Everything GDPR compliant.",
        },
        {
          q: "How many reviews can I realistically expect?",
          a: "It depends on your number of customers. A salon with 100 customers a month typically gets 15–30 new reviews in the first month. On the call I'll give you a concrete number for your case.",
        },
      ],
    },
    finalCta: {
      h2: "Your customers are happy. Google doesn't know it.",
      subtitle:
        "A 15-minute call. I'll tell you how many reviews you can expect — and if it's not worth it, I'll tell you that too.",
      cta: "Book a free call",
    },
    booking: {
      title: "Book a free call",
      subtitle: "Leave your details and we'll call you within one business day.",
      name: "Full name",
      business: "Business name",
      phone: "Phone number",
      profile: "Link to your Google profile (optional)",
      submit: "Send enquiry",
      note: "By submitting you agree to be contacted about the Revju service.",
    },
    footer: {
      desc: "After every appointment Revju automatically texts your customer and asks for a Google review. You do nothing.",
      linksTitle: "Links",
      links: [
        { label: "How it works", href: "#kako-deluje" },
        { label: "Pricing", href: "#cenik" },
        { label: "Shop", href: "#trgovina" },
        { label: "Contact", href: "#rezervacija" },
      ],
      legalTitle: "Legal",
      legal: [
        { label: "Privacy policy", href: "#zasebnost" },
        { label: "Terms", href: "#pogoji" },
      ],
      companyTitle: "Company",
      companyPending: "Company details — coming soon",
      rights: "All rights reserved.",
      madeIn: "Slovenia",
    },
  },
};
