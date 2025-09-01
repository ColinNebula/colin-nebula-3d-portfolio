// EmailJS Configuration
// You'll need to replace these with your actual EmailJS credentials after setting up your account

export const emailjsConfig = {
  // Your EmailJS Service ID (from your EmailJS dashboard)
  serviceId: 'service_64j2mwd',
  
  // Your EmailJS Template ID (create a template in your EmailJS dashboard)
  templateId: '__ejs-test-mail-service__',
  
  // Your EmailJS Public Key (from your EmailJS dashboard)
  publicKey: 'o7n5LE_OHI9NfL2eU'
};

// Template variables mapping
// Make sure your EmailJS template includes these variables:
// {{user_name}} - Subscriber's name
// {{user_email}} - Subscriber's email
// {{subscription_date}} - Date of subscription
// {{website_name}} - Your website name
// {{thank_you_message}} - Personalized thank you message
// {{welcome_message}} - Welcome message with benefits
// {{portfolio_link}} - Link to portfolio
// {{personal_note}} - Personal note from Colin

export const createEmailTemplate = (name, email) => ({
  user_name: name,
  user_email: email,
  subscription_date: new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  website_name: 'Colin Nebula 3D Portfolio',
  thank_you_message: `Dear ${name}, thank you so much for subscribing to my updates! I'm thrilled to have you join my creative journey.`,
  welcome_message: `As a subscriber, you'll be the first to know about my latest 3D projects, behind-the-scenes content, tutorials, and exclusive insights into my creative process.`,
  portfolio_link: 'https://colin-nebula-portfolio.netlify.app',
  personal_note: `I'm passionate about creating immersive 3D experiences and sharing knowledge with fellow creators. Your subscription means a lot to me, and I promise to deliver valuable content that inspires and educates.`,
  next_steps: `What's next? Keep an eye on your inbox for exciting updates, and feel free to explore my portfolio to see my latest work.`,
  signature: 'Best regards,\nColin Nebula\n3D Artist & Developer',
  reply_to: email
});