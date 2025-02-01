"use server"

export async function registerUser(formData: FormData) {
  // Here you would typically save the user data to a database
  // For this example, we'll just simulate a delay and return a success message
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true, message: "Registration successful! We'll contact you with your match on February 14th." }
}
