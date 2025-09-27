import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://nvgopjdirsatrlxkinnn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52Z29wamRpcnNhdHJseGtpbm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NjQwNzMsImV4cCI6MjA3NDU0MDA3M30.VaoXiqfOfGAjFyWhZUPhfz6x_qBlbEgUo3TSGlqUYVw'
const supabase = createClient(supabaseUrl, supabaseKey)