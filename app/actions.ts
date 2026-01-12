'use server'

import { supabase } from '@/lib/supabase'

export interface WaitlistActionState {
  success: boolean
  message: string
}

export async function subscribeToWaitlist(
  prevState: WaitlistActionState | null,
  formData: FormData
): Promise<WaitlistActionState> {
  const email = formData.get('email') as string

  // Validate email with simple regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    }
  }

  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single()

    // If email exists, return success (graceful handling)
    if (existing) {
      return {
        success: true,
        message: "You're already on the list!",
      }
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email: email.toLowerCase().trim() }])

    if (error) {
      // Handle duplicate key error gracefully
      if (error.code === '23505') {
        return {
          success: true,
          message: "You're already on the list!",
        }
      }
      throw error
    }

    return {
      success: true,
      message: "Welcome to the club!",
    }
  } catch (error) {
    console.error('Waitlist subscription error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    }
  }
}
