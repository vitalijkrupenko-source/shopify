export type Lang = "sl" | "en";

export interface Translation {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    howItWorks: string;
    features: string;
    results: string;
    pricing: string;
    faq: string;
    cta: string;
    login: string;
  };
  hero: {
    badge: string;
    title1: string;
    titleHighlight: string;
    title2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    cardBusiness: string;
    cardReviewsLabel: string;
    cardRankLabel: string;
    cardRankValue: string;
    cardNotification: string;
  };
  logos: {
    title: string;
  };
  problem: {
    kicker: string;
    title: string;
    subtitle: string;
    items: { stat: string; text: string }[];
  };
  how: {
    kicker: string;
    title: string;
    subtitle: string;
    steps: { number: string; title: string; text: string }[];
  };
  features: {
    kicker: string;
    title: string;
    subtitle: string;
    items: { icon: string; title: string; text: string }[];
  };
  results: {
    kicker: string;
    title: string;
    subtitle: string;
    stats: { value: string; label: string }[];
    quote: string;
    quoteAuthor: string;
    quoteRole: string;
  };
  testimonials: {
    kicker: string;
    title: string;
    subtitle: string;
    items: { quote: string; author: string; role: string }[];
  };
  pricing: {
    kicker: string;
    title: string;
    subtitle: string;
    monthly: string;
    perMonth: string;
    popular: string;
    cta: string;
    plans: {
      name: string;
      price: string;
      description: string;
      features: string[];
    }[];
    guarantee: string;
  };
  faq: {
    kicker: string;
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
  };
  footer: {
    tagline: string;
    productTitle: string;
    productLinks: string[];
    companyTitle: string;
    companyLinks: string[];
    legalTitle: string;
    legalLinks: string[];
    rights: string;
  };
}

export const translations: Record<Lang, Translation> = {
  sl: {
    meta: {
      title: "ReviewRise — Več Google ocen, višje uvrstitve, več strank",
      description:
        "Pomagamo lokalnim podjetjem pridobiti več Google ocen in se uvrstiti višje v lokalnem iskanju. Več ocen pomeni več klicev, več poslov in več prihodka.",
    },
    nav: {
      howItWorks: "Kako deluje",
      features: "Zmožnosti",
      results: "Rezultati",
      pricing: "Cenik",
      faq: "Pogosta vprašanja",
      cta: "Začni brezplačno",
      login: "Prijava",
    },
    hero: {
      badge: "Ocenjeno 5 zvezdic s strani več kot 500 lokalnih podjetij",
      title1: "Pridobite več",
      titleHighlight: "Google ocen",
      title2: "in prehitite konkurenco",
      subtitle:
        "ReviewRise samodejno pošilja vašim strankam vabila za oceno v pravem trenutku. Več ocen pomeni višjo uvrstitev na Googlu — kar pomeni več klicev, več naročil in več prihodka.",
      ctaPrimary: "Začni brezplačno",
      ctaSecondary: "Rezerviraj demo",
      trust: "Brez pogodbe · Postavljeno v 5 minutah · Prekliči kadarkoli",
      stat1Value: "3,4×",
      stat1Label: "več ocen v 90 dneh",
      stat2Value: "+38 %",
      stat2Label: "več klicev iz Googla",
      stat3Value: "4,9★",
      stat3Label: "povprečna ocena strank",
      cardBusiness: "Mizarstvo Novak",
      cardReviewsLabel: "Nove ocene ta mesec",
      cardRankLabel: "Uvrstitev v lokalnem iskanju",
      cardRankValue: "#1",
      cardNotification: "Nova 5★ ocena od Ane K.",
    },
    logos: {
      title: "Zaupajo nam lokalna podjetja po vsej Sloveniji",
    },
    problem: {
      kicker: "Zakaj je pomembno",
      title: "88 % ljudi zaupa spletnim ocenam enako kot osebnemu priporočilu",
      subtitle:
        "Vaše naslednje stranke prav zdaj iščejo na Googlu. Če imate manj ocen in nižjo oceno od konkurence, izberejo njih — ne vas.",
      items: [
        {
          stat: "76 %",
          text: "vseh lokalnih iskanj se konča z obiskom podjetja v 24 urah.",
        },
        {
          stat: "3,3★",
          text: "je najnižja ocena, ki jo bo povprečna stranka sploh upoštevala.",
        },
        {
          stat: "#1–3",
          text: "prva tri mesta na Googlu poberejo večino vseh klikov in klicev.",
        },
      ],
    },
    how: {
      kicker: "Kako deluje",
      title: "Več ocen v treh preprostih korakih",
      subtitle:
        "Nastavite enkrat in ReviewRise poskrbi za ostalo. Brez zapletov, brez ročnega dela.",
      steps: [
        {
          number: "01",
          title: "Povežite svoj profil",
          text: "Povežite svoj Google Poslovni profil v nekaj klikih. Uvozimo vaše obstoječe ocene in nastavimo vse namesto vas.",
        },
        {
          number: "02",
          title: "Pošljemo vabila",
          text: "Po vsaki opravljeni storitvi samodejno pošljemo vaši stranki prijazno SMS ali e-poštno vabilo za oceno — v pravem trenutku.",
        },
        {
          number: "03",
          title: "Ocene rastejo, uvrstitev raste",
          text: "Zadovoljne stranke z enim klikom pustijo 5★ oceno. Google to opazi in vas dvigne višje v rezultatih iskanja.",
        },
      ],
    },
    features: {
      kicker: "Zmožnosti",
      title: "Vse, kar potrebujete za več ocen",
      subtitle:
        "Zmogljiva orodja, ki so tako preprosta, da jih obvladate v nekaj minutah.",
      items: [
        {
          icon: "send",
          title: "Samodejna vabila",
          text: "Pošiljajte vabila za oceno prek SMS-a in e-pošte samodejno ali z enim klikom. Nastavite čas in besedilo po svojih željah.",
        },
        {
          icon: "shield",
          title: "Prestreganje slabih izkušenj",
          text: "Nezadovoljne stranke usmerimo v zasebno povratno informacijo, preden objavijo javno oceno. Zaščitite svoj ugled.",
        },
        {
          icon: "qr",
          title: "QR kode in povezave",
          text: "Natisnite QR kodo za pult ali dodajte gumb na spletno stran. Stranke oddajo oceno v nekaj sekundah.",
        },
        {
          icon: "chart",
          title: "Sledenje uvrstitvam",
          text: "Spremljajte, kje se uvrščate za ključne besede v vaši okolici, in kako vas prehitevate konkurenco iz tedna v teden.",
        },
        {
          icon: "reply",
          title: "AI odgovori na ocene",
          text: "Odgovorite na vsako oceno v svojem slogu z enim klikom. Google nagrajuje podjetja, ki se odzivajo.",
        },
        {
          icon: "star",
          title: "Prikaz ocen na spletu",
          text: "Predstavite svoje najboljše ocene na spletni strani z elegantnimi, samodejno posodobljenimi pripomočki.",
        },
      ],
    },
    results: {
      kicker: "Rezultati",
      title: "Številke, ki spremenijo posel",
      subtitle:
        "Povprečni rezultati naših strank v prvih 90 dneh uporabe ReviewRise.",
      stats: [
        { value: "3,4×", label: "več novih ocen na mesec" },
        { value: "+38 %", label: "več klicev in poizvedb" },
        { value: "+1,2★", label: "dvig povprečne ocene" },
        { value: "#1", label: "povprečna uvrstitev v okolici" },
      ],
      quote:
        "Prej smo dobili morda eno oceno na mesec. Z ReviewRise jih dobimo 15 do 20. Zdaj smo prvi na Googlu za »mizar Ljubljana« in telefon ne neha zvoniti.",
      quoteAuthor: "Marko Novak",
      quoteRole: "Lastnik, Mizarstvo Novak",
    },
    testimonials: {
      kicker: "Mnenja strank",
      title: "Lokalna podjetja, ki rastejo z nami",
      subtitle: "Ne verjemite nam na besedo — poslušajte njih.",
      items: [
        {
          quote:
            "V treh mesecih smo z 22 prišli na 140 ocen. Rezervacije so se podvojile. Najboljša naložba za naš salon doslej.",
          author: "Nina Horvat",
          role: "Frizerski salon Bella",
        },
        {
          quote:
            "Končno se uvrščamo pred veliko verigo v mestu. Stranke redno omenjajo, da so nas našle na Googlu zaradi ocen.",
          author: "Luka Kovač",
          role: "Avtoservis Kovač",
        },
        {
          quote:
            "Nastavitev je trajala pet minut. Zdaj vse teče samodejno, jaz pa se lahko posvetim strankam. Priporočam vsakemu obrtniku.",
          author: "Petra Zupan",
          role: "Zobozdravstvena ordinacija Nasmeh",
        },
      ],
    },
    pricing: {
      kicker: "Cenik",
      title: "Preprost cenik, ki se povrne",
      subtitle:
        "Ena nova stranka na mesec pokrije celoten strošek. Vse ostalo je čisti dobiček.",
      monthly: "Mesečno",
      perMonth: "/mesec",
      popular: "Najbolj priljubljeno",
      cta: "Začni brezplačno",
      plans: [
        {
          name: "Zagon",
          price: "29 €",
          description: "Za samostojne podjetnike in majhne obrti.",
          features: [
            "Do 50 vabil na mesec",
            "SMS in e-poštna vabila",
            "Google Poslovni profil",
            "QR koda in povezava za ocene",
            "Osnovna analitika",
          ],
        },
        {
          name: "Rast",
          price: "59 €",
          description: "Za rastoča lokalna podjetja z eno lokacijo.",
          features: [
            "Neomejena vabila",
            "Prestreganje slabih izkušenj",
            "Sledenje uvrstitvam",
            "AI odgovori na ocene",
            "Prikaz ocen na spletni strani",
            "Prednostna podpora",
          ],
        },
        {
          name: "Veriga",
          price: "129 €",
          description: "Za več lokacij in ekipe.",
          features: [
            "Vse iz paketa Rast",
            "Do 5 lokacij",
            "Skupna nadzorna plošča",
            "Uporabniški računi za ekipo",
            "Namenski svetovalec",
            "Poročila po meri",
          ],
        },
      ],
      guarantee: "30-dnevna garancija vračila denarja · Brez pogodbe",
    },
    faq: {
      kicker: "Pogosta vprašanja",
      title: "Odgovori na vaša vprašanja",
      subtitle: "Vse, kar morate vedeti, preden začnete.",
      items: [
        {
          q: "Ali je pošiljanje vabil za oceno skladno s pravili Googla?",
          a: "Da. Google izrecno spodbuja podjetja, naj prosijo stranke za ocene. ReviewRise pošilja prijazna vabila vsem strankam enako in nikoli ne ponuja plačila ali nagrad za ocene, kar je popolnoma v skladu s smernicami.",
        },
        {
          q: "Koliko časa traja, da vidim rezultate?",
          a: "Večina strank prejme prve nove ocene že v prvem tednu. Opazen dvig uvrstitve v lokalnem iskanju običajno nastopi v 30 do 90 dneh, odvisno od vaše panoge in konkurence.",
        },
        {
          q: "Kaj pa negativne ocene?",
          a: "Naš sistem najprej vpraša stranko o njeni izkušnji. Zadovoljne usmeri na Google, nezadovoljne pa v zasebni obrazec, kjer vam sporočijo povratno informacijo — tako imate priložnost, da težavo rešite, preden postane javna.",
        },
        {
          q: "Ali potrebujem tehnično znanje?",
          a: "Ne. Postavitev traja približno pet minut in vam pomagamo pri vsakem koraku. Če znate uporabljati telefon, znate uporabljati ReviewRise.",
        },
        {
          q: "Ali lahko kadarkoli prekličem?",
          a: "Seveda. Ni pogodb in ni odpovednih rokov. Naročnino lahko prekličete z enim klikom, poleg tega pa nudimo 30-dnevno garancijo vračila denarja.",
        },
      ],
    },
    finalCta: {
      title: "Vaše naslednje stranke vas iščejo prav zdaj",
      subtitle:
        "Vsak dan brez novih ocen je dan, ko konkurenca prehiteva vas. Začnite danes in prehitite jih.",
      ctaPrimary: "Začni brezplačno",
      ctaSecondary: "Rezerviraj demo",
      note: "14 dni brezplačno · Ni potrebna kreditna kartica",
    },
    footer: {
      tagline:
        "ReviewRise pomaga lokalnim podjetjem pridobiti več Google ocen, se uvrstiti višje in pridobiti več strank.",
      productTitle: "Produkt",
      productLinks: ["Kako deluje", "Zmožnosti", "Cenik", "Rezerviraj demo"],
      companyTitle: "Podjetje",
      companyLinks: ["O nas", "Mnenja strank", "Blog", "Kariera"],
      legalTitle: "Pravno",
      legalLinks: ["Zasebnost", "Pogoji", "Piškotki"],
      rights: "Vse pravice pridržane.",
    },
  },
  en: {
    meta: {
      title: "ReviewRise — More Google reviews, higher rankings, more customers",
      description:
        "We help local businesses get more Google reviews and rank higher in local search. More reviews means more calls, more jobs and more revenue.",
    },
    nav: {
      howItWorks: "How it works",
      features: "Features",
      results: "Results",
      pricing: "Pricing",
      faq: "FAQ",
      cta: "Start free",
      login: "Log in",
    },
    hero: {
      badge: "Rated 5 stars by 500+ local businesses",
      title1: "Get more",
      titleHighlight: "Google reviews",
      title2: "and outrank your competition",
      subtitle:
        "ReviewRise automatically sends your customers review invitations at the perfect moment. More reviews means a higher spot on Google — which means more calls, more bookings and more revenue.",
      ctaPrimary: "Start free",
      ctaSecondary: "Book a demo",
      trust: "No contract · Set up in 5 minutes · Cancel anytime",
      stat1Value: "3.4×",
      stat1Label: "more reviews in 90 days",
      stat2Value: "+38%",
      stat2Label: "more calls from Google",
      stat3Value: "4.9★",
      stat3Label: "average customer rating",
      cardBusiness: "Novak Woodworks",
      cardReviewsLabel: "New reviews this month",
      cardRankLabel: "Local search rank",
      cardRankValue: "#1",
      cardNotification: "New 5★ review from Anna K.",
    },
    logos: {
      title: "Trusted by local businesses across the country",
    },
    problem: {
      kicker: "Why it matters",
      title: "88% of people trust online reviews as much as a personal recommendation",
      subtitle:
        "Your next customers are searching on Google right now. If you have fewer reviews and a lower rating than your competitors, they win the job — not you.",
      items: [
        {
          stat: "76%",
          text: "of all local searches result in a business visit within 24 hours.",
        },
        {
          stat: "3.3★",
          text: "is the lowest rating the average customer will even consider.",
        },
        {
          stat: "#1–3",
          text: "the top three spots on Google capture the majority of all clicks and calls.",
        },
      ],
    },
    how: {
      kicker: "How it works",
      title: "More reviews in three simple steps",
      subtitle:
        "Set it up once and ReviewRise handles the rest. No hassle, no manual work.",
      steps: [
        {
          number: "01",
          title: "Connect your profile",
          text: "Connect your Google Business Profile in a few clicks. We import your existing reviews and set everything up for you.",
        },
        {
          number: "02",
          title: "We send the invitations",
          text: "After every completed job we automatically send your customer a friendly SMS or email review invitation — at exactly the right moment.",
        },
        {
          number: "03",
          title: "Reviews grow, rankings rise",
          text: "Happy customers leave a 5★ review with one tap. Google notices and pushes you higher in the search results.",
        },
      ],
    },
    features: {
      kicker: "Features",
      title: "Everything you need for more reviews",
      subtitle:
        "Powerful tools that are simple enough to master in minutes.",
      items: [
        {
          icon: "send",
          title: "Automated invitations",
          text: "Send review requests by SMS and email automatically or with one click. Set the timing and wording exactly how you like.",
        },
        {
          icon: "shield",
          title: "Bad-experience filter",
          text: "We route unhappy customers to private feedback before they post publicly. Protect your reputation.",
        },
        {
          icon: "qr",
          title: "QR codes and links",
          text: "Print a QR code for your counter or add a button to your website. Customers leave a review in seconds.",
        },
        {
          icon: "chart",
          title: "Rank tracking",
          text: "See where you rank for the keywords in your area, and how you're overtaking competitors week by week.",
        },
        {
          icon: "reply",
          title: "AI review replies",
          text: "Reply to every review in your own voice with one click. Google rewards businesses that respond.",
        },
        {
          icon: "star",
          title: "Review widgets",
          text: "Showcase your best reviews on your website with elegant, auto-updating widgets.",
        },
      ],
    },
    results: {
      kicker: "Results",
      title: "Numbers that change your business",
      subtitle:
        "Average results our customers see in their first 90 days on ReviewRise.",
      stats: [
        { value: "3.4×", label: "more new reviews per month" },
        { value: "+38%", label: "more calls and enquiries" },
        { value: "+1.2★", label: "lift in average rating" },
        { value: "#1", label: "average local rank" },
      ],
      quote:
        "We used to get maybe one review a month. With ReviewRise we get 15 to 20. We're now number one on Google for 'carpenter near me' and the phone doesn't stop ringing.",
      quoteAuthor: "Mark Novak",
      quoteRole: "Owner, Novak Woodworks",
    },
    testimonials: {
      kicker: "Testimonials",
      title: "Local businesses growing with us",
      subtitle: "Don't take our word for it — hear it from them.",
      items: [
        {
          quote:
            "In three months we went from 22 to 140 reviews. Bookings doubled. Best investment our salon has ever made.",
          author: "Nina Horvat",
          role: "Bella Hair Salon",
        },
        {
          quote:
            "We finally rank ahead of the big chain in town. Customers constantly mention they found us on Google because of the reviews.",
          author: "Luke Kovac",
          role: "Kovac Auto Repair",
        },
        {
          quote:
            "Setup took five minutes. Now everything runs on autopilot and I can focus on my customers. I recommend it to every tradesperson.",
          author: "Petra Zupan",
          role: "Smile Dental Practice",
        },
      ],
    },
    pricing: {
      kicker: "Pricing",
      title: "Simple pricing that pays for itself",
      subtitle:
        "One new customer a month covers the entire cost. Everything after that is pure profit.",
      monthly: "Monthly",
      perMonth: "/month",
      popular: "Most popular",
      cta: "Start free",
      plans: [
        {
          name: "Starter",
          price: "€29",
          description: "For solo owners and small trades.",
          features: [
            "Up to 50 invitations per month",
            "SMS and email invitations",
            "Google Business Profile",
            "Review QR code and link",
            "Basic analytics",
          ],
        },
        {
          name: "Growth",
          price: "€59",
          description: "For growing single-location businesses.",
          features: [
            "Unlimited invitations",
            "Bad-experience filter",
            "Rank tracking",
            "AI review replies",
            "Website review widgets",
            "Priority support",
          ],
        },
        {
          name: "Multi",
          price: "€129",
          description: "For multiple locations and teams.",
          features: [
            "Everything in Growth",
            "Up to 5 locations",
            "Unified dashboard",
            "Team member accounts",
            "Dedicated advisor",
            "Custom reporting",
          ],
        },
      ],
      guarantee: "30-day money-back guarantee · No contract",
    },
    faq: {
      kicker: "FAQ",
      title: "Answers to your questions",
      subtitle: "Everything you need to know before you start.",
      items: [
        {
          q: "Is sending review invitations compliant with Google's rules?",
          a: "Yes. Google explicitly encourages businesses to ask customers for reviews. ReviewRise sends friendly invitations to all customers equally and never offers payment or rewards for reviews, which is fully within the guidelines.",
        },
        {
          q: "How long until I see results?",
          a: "Most customers receive their first new reviews within the first week. A noticeable lift in local search ranking usually appears within 30 to 90 days, depending on your industry and competition.",
        },
        {
          q: "What about negative reviews?",
          a: "Our system first asks the customer about their experience. It routes happy ones to Google, and unhappy ones to a private form where they share feedback with you — giving you the chance to fix the issue before it becomes public.",
        },
        {
          q: "Do I need technical skills?",
          a: "No. Setup takes about five minutes and we help you every step of the way. If you can use a phone, you can use ReviewRise.",
        },
        {
          q: "Can I cancel anytime?",
          a: "Absolutely. There are no contracts and no notice periods. You can cancel your subscription with one click, and we back it with a 30-day money-back guarantee.",
        },
      ],
    },
    finalCta: {
      title: "Your next customers are searching for you right now",
      subtitle:
        "Every day without new reviews is a day your competition gets ahead. Start today and overtake them.",
      ctaPrimary: "Start free",
      ctaSecondary: "Book a demo",
      note: "14 days free · No credit card required",
    },
    footer: {
      tagline:
        "ReviewRise helps local businesses get more Google reviews, rank higher and win more customers.",
      productTitle: "Product",
      productLinks: ["How it works", "Features", "Pricing", "Book a demo"],
      companyTitle: "Company",
      companyLinks: ["About", "Testimonials", "Blog", "Careers"],
      legalTitle: "Legal",
      legalLinks: ["Privacy", "Terms", "Cookies"],
      rights: "All rights reserved.",
    },
  },
};
