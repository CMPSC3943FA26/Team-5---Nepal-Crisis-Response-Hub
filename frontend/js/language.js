const nepaliLabels = new Map(Object.entries({
    "Nepal Crisis Response Hub": "नेपाल विपद् प्रतिकार्य केन्द्र",
    "Home": "गृहपृष्ठ",
    "Alerts": "सूचनाहरू",
    "Resources": "स्रोतहरू",
    "Recovery Support": "पुनर्स्थापना सहयोग",
    "Safety": "सुरक्षा",
    "Request Help": "सहायता माग्नुहोस्",
    "Login": "लगइन",
    "Register": "दर्ता",
    "Dashboard": "ड्यासबोर्ड",
    "Admin": "प्रशासन",
    "Logout": "लगआउट",
    "Donate": "दान गर्नुहोस्",
    "Emergency Information & Assistance": "आपत्कालीन सूचना र सहायता",
    "Reliable information when it matters most.": "आवश्यक समयमा भरपर्दो सूचना।",
    "Access crisis alerts, emergency resources, safety information, and assistance during emergencies in Nepal.": "नेपालमा आपत्कालीन समयमा विपद् सूचना, स्रोत, सुरक्षा जानकारी र सहायता प्राप्त गर्नुहोस्।",
    "View Crisis Alerts": "विपद् सूचनाहरू हेर्नुहोस्",
    "Request Emergency Help": "आपत्कालीन सहायता माग्नुहोस्",
    "Current Crisis Alerts": "हालका विपद् सूचनाहरू",
    "Emergency Notifications": "आपत्कालीन सूचनाहरू",
    "New simulated crisis alerts are available.": "नयाँ नमुना विपद् सूचनाहरू उपलब्ध छन्।",
    "Prototype demonstration information only.": "यो जानकारी नमुना प्रदर्शनका लागि मात्र हो।",
    "Filter by Disaster Type": "विपद्को प्रकारअनुसार छान्नुहोस्",
    "Filter by Location": "स्थानअनुसार छान्नुहोस्",
    "All Alerts": "सबै सूचनाहरू",
    "Clear Location": "स्थान मेटाउनुहोस्",
    "Demo Alert": "नमुना सूचना",
    "Flood Safety Advisory": "बाढी सुरक्षा सूचना",
    "Verified Alert": "प्रमाणित सूचना",
    "View Details": "विवरण हेर्नुहोस्",
    "Hide Details": "विवरण लुकाउनुहोस्",
    "Location": "स्थान",
    "Type": "प्रकार",
    "Severity": "गम्भीरता",
    "Description": "विवरण",
    "Safety Instructions": "सुरक्षा निर्देशन",
    "Published": "प्रकाशित",
    "Last Updated": "पछिल्लो अद्यावधिक",
    "Verification": "प्रमाणीकरण",
    "Prototype verified alert": "नमुना प्रमाणित सूचना",
    "Not available": "उपलब्ध छैन",
    "Not provided": "दिइएको छैन",
    "Flood": "बाढी",
    "Earthquake": "भूकम्प",
    "Landslide": "पहिरो",
    "Severe Weather": "प्रतिकूल मौसम",
    "Public Safety": "सार्वजनिक सुरक्षा",
    "Fire": "आगलागी",
    "Other": "अन्य",
    "Low": "न्यून",
    "Medium": "मध्यम",
    "Moderate": "मध्यम",
    "High": "उच्च",
    "Critical": "अति गम्भीर",
    "Find Nearby Emergency Resources": "नजिकका आपत्कालीन स्रोतहरू खोज्नुहोस्",
    "Enter Location": "स्थान लेख्नुहोस्",
    "Resource Type": "स्रोतको प्रकार",
    "All Resources": "सबै स्रोतहरू",
    "Hospitals": "अस्पतालहरू",
    "Relief Centers": "राहत केन्द्रहरू",
    "Example: Kathmandu or Pokhara": "उदाहरण: काठमाडौं वा पोखरा",
    "No crisis alerts match your selected filters.": "छानिएका मापदण्डसँग मिल्ने विपद् सूचना छैन।",
    "Safety Information": "सुरक्षा जानकारी",
    "Emergency Preparedness": "आपत्कालीन तयारी",
    "Emergency Contacts": "आपत्कालीन सम्पर्कहरू",
    "Emergency Resources": "आपत्कालीन स्रोतहरू",
    "Hospitals Across Nepal": "नेपालभरका अस्पतालहरू",
    "Shelters": "आश्रयस्थलहरू",
    "Disaster Response Organizations": "विपद् प्रतिकार्य संस्थाहरू",
    "Police": "प्रहरी",
    "Ambulance": "एम्बुलेन्स",
    "Nepal Red Cross Hotline": "नेपाल रेडक्रस हटलाइन",
    "Nepal Red Cross Society": "नेपाल रेडक्रस सोसाइटी",
    "Crisis Recovery Resources": "विपद्पछिका पुनर्स्थापना स्रोतहरू",
    "Search Missing-Person Reports": "बेपत्ता व्यक्तिका विवरण खोज्नुहोस्",
    "Search by Name": "नामबाट खोज्नुहोस्",
    "Request Emergency Assistance": "आपत्कालीन सहयोग माग्नुहोस्",
    "This form is currently part of the prototype and does not contact real emergency services.": "यो नमुना फारामबाट वास्तविक आपत्कालीन सेवामा सम्पर्क हुँदैन।",
    "Assistance Type": "सहायताको प्रकार",
    "Select assistance": "सहायताको प्रकार छान्नुहोस्",
    "Medical Assistance": "चिकित्सा सहायता",
    "Rescue": "उद्धार",
    "Food": "खाना",
    "Shelter": "आश्रय",
    "Use My Current Location": "मेरो हालको स्थान प्रयोग गर्नुहोस्",
    "Enter your location": "आफ्नो स्थान लेख्नुहोस्",
    "Urgency": "अत्यावश्यकता",
    "Select urgency": "अत्यावश्यकता छान्नुहोस्",
    "Describe the assistance needed": "आवश्यक सहयोगको विवरण लेख्नुहोस्",
    "Submit Prototype Request": "नमुना अनुरोध पठाउनुहोस्",
    "Prototype request saved successfully in this browser.": "नमुना अनुरोध यस ब्राउजरमा सुरक्षित भयो।",
    "Your browser does not support location sharing.": "यो ब्राउजरमा स्थान साझा गर्ने सुविधा छैन।",
    "Requesting location permission...": "स्थान प्रयोग गर्ने अनुमति मागिँदै छ…",
    "Location added. It will be shared when you submit your request.": "स्थान थपियो। अनुरोध पठाउँदा यो स्थान साझा हुनेछ।",
    "Location access unavailable or denied. You can enter your location manually.": "स्थान प्राप्त गर्न सकिएन। तपाईं आफ्नो स्थान आफैँ लेख्न सक्नुहुन्छ।",
    "Manual location entered. GPS coordinates will not be shared.": "स्थान आफैँ लेखिएको छ। जीपीएस निर्देशाङ्क साझा हुने छैनन्।",
    "Are you sure you want to cancel this help request?": "के तपाईं यो सहायता अनुरोध रद्द गर्न चाहनुहुन्छ?",
    "Enter additional information about your request:": "आफ्नो अनुरोधबारे थप जानकारी लेख्नुहोस्:",
    "Update Response Status": "प्रतिकार्यको स्थिति अद्यावधिक गर्नुहोस्",
    "Welcome,": "स्वागत छ,",
    "Track My Requests": "मेरा अनुरोधहरू हेर्नुहोस्",
    "View Requests": "अनुरोधहरू हेर्नुहोस्",
    "View Alerts": "सूचनाहरू हेर्नुहोस्",
    "Volunteer Registration": "स्वयंसेवक दर्ता",
    "Crisis Alerts": "विपद् सूचनाहरू",
    "Available Help Requests": "उपलब्ध सहायता अनुरोधहरू",
    "My Assigned Requests": "मलाई तोकिएका अनुरोधहरू",
    "My Help Requests": "मेरा सहायता अनुरोधहरू",
    "My Request Summary": "मेरा अनुरोधहरूको सारांश",
    "My Request History": "मेरा पुराना अनुरोधहरू",
    "Total Requests": "कुल अनुरोधहरू",
    "Pending": "प्रतीक्षामा",
    "In Progress": "प्रगतिमा",
    "Completed": "सम्पन्न",
    "Canceled": "रद्द गरिएको",
    "Status": "स्थिति",
    "Edit Request": "अनुरोध सम्पादन गर्नुहोस्",
    "Cancel Request": "अनुरोध रद्द गर्नुहोस्",
    "Add Note": "टिप्पणी थप्नुहोस्",
    "Contact Responder": "प्रतिकार्यकर्तासँग सम्पर्क गर्नुहोस्",
    "Submitted by": "अनुरोध पठाउने खाता",
    "Guest (no account)": "अतिथि (खाता छैन)",
    "Additional Notes": "थप टिप्पणीहरू",
    "No additional notes yet.": "अहिलेसम्म थप टिप्पणी छैन।",
    "No requests found.": "कुनै अनुरोध भेटिएन।",
    "Report an Emergency Incident": "आपत्कालीन घटना रिपोर्ट गर्नुहोस्",
    "Incident Type": "घटनाको प्रकार",
    "Submit Incident Report": "घटना रिपोर्ट पठाउनुहोस्",
    "Manage Crisis Alerts": "विपद् सूचनाहरू व्यवस्थापन गर्नुहोस्",
    "Manage Alerts": "सूचनाहरू व्यवस्थापन गर्नुहोस्",
    "Alert Title": "सूचनाको शीर्षक",
    "Alert Type": "सूचनाको प्रकार",
    "Severity Level": "गम्भीरताको तह",
    "Alert Description": "सूचनाको विवरण",
    "Publish Prototype Alert": "नमुना सूचना प्रकाशित गर्नुहोस्",
    "Publish Alert": "सूचना प्रकाशित गर्नुहोस्",
    "Publish Verified Crisis Alert": "प्रमाणित विपद् सूचना प्रकाशित गर्नुहोस्",
    "Published Alerts": "प्रकाशित सूचनाहरू",
    "Manage Emergency Help Requests": "आपत्कालीन सहायता अनुरोधहरू व्यवस्थापन गर्नुहोस्",
    "Manage Resource Availability": "स्रोतको उपलब्धता व्यवस्थापन गर्नुहोस्",
    "Create Account": "खाता खोल्नुहोस्",
    "Create an Account": "खाता खोल्नुहोस्",
    "Register as a volunteer responder": "स्वयंसेवक प्रतिकार्यकर्ताका रूपमा दर्ता गर्नुहोस्",
    "Create a prototype account to access assistance features.": "सहायता सुविधाहरू प्रयोग गर्न नमुना खाता खोल्नुहोस्।",
    "Enter your full name": "आफ्नो पूरा नाम लेख्नुहोस्",
    "Create a password": "पासवर्ड बनाउनुहोस्",
    "Confirm your password": "आफ्नो पासवर्ड पुष्टि गर्नुहोस्",
    "Already have an account?": "पहिले नै खाता छ?",
    "Passwords do not match.": "पासवर्डहरू मिलेनन्।",
    "A prototype account with this email already exists.": "यो इमेलबाट नमुना खाता पहिले नै खोलिएको छ।",
    "Prototype account created successfully.": "नमुना खाता खोलियो।",
    "Prototype login successful.": "नमुना खातामा लगइन भयो।",
    "Invalid prototype email or password.": "नमुना खाताको इमेल वा पासवर्ड मिलेन।",
    "Email": "इमेल",
    "Password": "पासवर्ड",
    "Confirm Password": "पासवर्ड पुष्टि गर्नुहोस्",
    "Full Name": "पूरा नाम",
    "Create an account": "खाता खोल्नुहोस्",
    "Create Prototype Account": "नमुना खाता खोल्नुहोस्",
    "Enter your email": "आफ्नो इमेल लेख्नुहोस्",
    "Enter your password": "आफ्नो पासवर्ड लेख्नुहोस्",
    "Sign in to access your emergency assistance requests.": "आफ्ना आपत्कालीन सहायता अनुरोधहरू हेर्न लगइन गर्नुहोस्।",
    "Don't have an account?": "खाता छैन?",
    "Make a Donation": "दान गर्नुहोस्",
    "Classroom simulation. No money is collected.": "कक्षाको अभ्यासका लागि मात्र। पैसा संकलन गरिँदैन।",
    "Amount in Nepali rupees (NPR)": "नेपाली रुपैयाँमा रकम (NPR)",
    "Log in to make a demo donation": "नमुना दान गर्न लगइन गर्नुहोस्",
    "Confirm Demo Donation": "नमुना दान पुष्टि गर्नुहोस्",
    "Demo donation recorded.": "नमुना दान दर्ता भयो।",
    "Demo donation": "नमुना दान",
    "View Donation History": "दानको विवरण हेर्नुहोस्",
    "Donation History": "दानको विवरण",
    "No demo donations yet.": "अहिलेसम्म कुनै नमुना दान छैन।",
    "Save Contact": "सम्पर्क सुरक्षित गर्नुहोस्",
    "Saved Emergency Contacts": "सुरक्षित आपत्कालीन सम्पर्कहरू",
    "View Saved Contacts": "सुरक्षित सम्पर्कहरू हेर्नुहोस्",
    "Browse Emergency Contacts": "आपत्कालीन सम्पर्कहरू हेर्नुहोस्",
    "No saved contacts yet.": "अहिलेसम्म कुनै सम्पर्क सुरक्षित गरिएको छैन।",
    "Remove": "हटाउनुहोस्",
    "Contact removed.": "सम्पर्क हटाइयो।",
    "Log in to save emergency contacts.": "आपत्कालीन सम्पर्क सुरक्षित गर्न लगइन गर्नुहोस्।",
    "This contact is already saved.": "यो सम्पर्क पहिले नै सुरक्षित गरिएको छ।",
    "Contact saved to your dashboard.": "सम्पर्क तपाईंको ड्यासबोर्डमा सुरक्षित भयो।"
}));

const interfaceText = new WeakMap();
const interfacePlaceholders = new WeakMap();
const languageToggle = document.getElementById("languageToggle");
let interfaceLanguage = localStorage.getItem("prototypeLanguage") === "ne" ? "ne" : "en";

function translateLabel(english) {
    return interfaceLanguage === "ne" ? (nepaliLabels.get(english) || english) : english;
}

// Register application labels explicitly so account data stays exactly as entered.
function setInterfaceText(element, english) {
    element.textContent = english;
    if (!element.firstChild) return;
    interfaceText.set(element.firstChild, english);
    element.firstChild.nodeValue = translateLabel(english);
}

const staticLabels = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
        if (node.parentElement.closest("script, style")) return NodeFilter.FILTER_REJECT;
        const label = node.nodeValue.trim().replace(/\s+/g, " ");
        return nepaliLabels.has(label.replace(/:$/, "")) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
});

while (staticLabels.nextNode()) {
    const node = staticLabels.currentNode;
    const option = node.parentElement;
    if (option.tagName === "OPTION" && !option.hasAttribute("value")) option.setAttribute("value", option.value);
    interfaceText.set(node, node.nodeValue);
}

for (const field of document.querySelectorAll("[placeholder]")) {
    interfacePlaceholders.set(field, field.placeholder);
}

function applyInterfaceLanguage() {
    document.documentElement.lang = interfaceLanguage;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        const original = interfaceText.get(node);
        if (original === undefined) continue;
        if (interfaceLanguage === "en") {
            node.nodeValue = original;
            continue;
        }
        const label = original.trim().replace(/\s+/g, " ");
        node.nodeValue = original.replace(/\S[\s\S]*\S|\S/, translateLabel(label.replace(/:$/, "")) + (label.endsWith(":") ? ":" : ""));
    }
    for (const field of document.querySelectorAll("[placeholder]")) {
        const original = interfacePlaceholders.get(field);
        if (original) field.placeholder = translateLabel(original);
    }
    languageToggle.textContent = interfaceLanguage === "en" ? "नेपाली" : "English";
    languageToggle.lang = interfaceLanguage === "en" ? "ne" : "en";
    languageToggle.setAttribute("aria-label", interfaceLanguage === "en" ? "Switch to Nepali" : "अंग्रेजीमा बदल्नुहोस्");
}

languageToggle.addEventListener("click", () => {
    interfaceLanguage = interfaceLanguage === "en" ? "ne" : "en";
    localStorage.setItem("prototypeLanguage", interfaceLanguage);
    applyInterfaceLanguage();
});
applyInterfaceLanguage();
