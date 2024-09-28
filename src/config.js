import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

/** OpenAI config */
if (!process.env.REACT_APP_OPENAI_API_KEY)
  throw new Error('OpenAI API key is missing or invalid.');
export const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/** Supabase config */
const privateKey = process.env.REACT_APP_SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var REACT_APP_SUPABASE_API_KEY`);
const url = process.env.REACT_APP_SUPABASE_URL;
if (!url) throw new Error(`Expected env var REACT_APP_SUPABASE_URL`);
export const supabase = createClient(url, privateKey);
