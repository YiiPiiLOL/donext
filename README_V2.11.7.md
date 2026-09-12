# DoNext V2.11.7

First Real App foundation: session auth, per-user state, coach
onboarding, API-token removal from UI, and Capacitor Android packaging
configuration.

## V2.11.7 focus

-   Session-based authentication foundation.
-   Per-user training state and history.
-   Coach onboarding foundation.
-   API-token configuration removed from the normal user experience.
-   Capacitor Android packaging configuration for the real-app path.
-   Google and Apple provider credentials remain a deployment
    prerequisite.

## V2.11.4

-   Historikposter är klickbara och öppnar detaljer för exakt genomfört
    pass.
-   Detaljvyn visar övningar, faktisk vikt, reps per set, målintervall,
    rekommenderad vikt när den finns, kommentarer och passkommentar.
-   Den rekommenderade vikten är ett enda redigerbart viktfält; ingen
    separat "actual weight"-ruta visas.
-   Framtida rekommendationer använder faktisk vikt från senaste
    genomförda pass.
-   V2.11.2:s local-first, draft persistence och event-driven sync är
    bevarade.

## V2.11.2

-   Ingen kontinuerlig polling som kan skriva över pågående
    träningsinmatning.
-   Event-driven synkning vid appstart, efter sparat pass, när
    anslutningen återkommer och via manuell synkning.
-   Pågående träningsinmatning skyddas från att remote state skriver
    över formuläret.
-   Pågående pass sparas som draft lokalt och återställs efter
    omladdning/appstart.
-   Offline-sparade pass ligger kvar lokalt tills anslutningen är
    tillbaka.
