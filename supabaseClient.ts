import { createClient } from '@supabase/supabase-js';

// ATTENZIONE: Sostituisci con i tuoi dati presi da Supabase!
// Vai su Project Settings > API nel tuo progetto Supabase per trovarli.
const supabaseUrl = 'IL_TUO_URL_SUPABASE'; // Esempio: 'https://xxxxxxxxxxxxxx.supabase.co'
const supabaseAnonKey = 'LA_TUA_CHIAVE_ANON'; // Esempio: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

export const areSupabaseCredentialsSet = 
    supabaseUrl !== 'IL_TUO_URL_SUPABASE' && 
    supabaseAnonKey !== 'LA_TUA_CHIAVE_ANON' &&
    !!supabaseUrl && !!supabaseAnonKey;

if (!areSupabaseCredentialsSet) {
    console.error("Errore: Le credenziali di Supabase non sono state impostate nel file supabaseClient.ts. L'applicazione non funzionerà correttamente.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
