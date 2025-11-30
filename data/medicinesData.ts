import { Pharmacy, MedicineProduct } from '../types';

export const pharmacies: Pharmacy[] = [
    { id: 401, name: "Wellness Forever", deliveryTime: "15-20 min", imageUrl: "https://picsum.photos/400/300?random=401", isOpen247: true },
    { id: 402, name: "City Medicals", deliveryTime: "20-25 min", imageUrl: "https://picsum.photos/400/300?random=402", isOpen247: false },
    { id: 403, name: "HealthFirst Pharmacy", deliveryTime: "10-15 min", imageUrl: "https://picsum.photos/400/300?random=403", isOpen247: true },
    { id: 404, name: "Community Care", deliveryTime: "25-30 min", imageUrl: "https://picsum.photos/400/300?random=404", isOpen247: false },
    { id: 405, name: "Apollo Pharmacy", deliveryTime: "12-18 min", imageUrl: "https://picsum.photos/400/300?random=405", isOpen247: true },
    { id: 406, name: "MedPlus", deliveryTime: "20-25 min", imageUrl: "https://picsum.photos/400/300?random=406", isOpen247: false },
    { id: 407, name: "Guardian Pharmacy", deliveryTime: "18-22 min", imageUrl: "https://picsum.photos/400/300?random=407", isOpen247: false },
    { id: 408, name: "24x7 Medico", deliveryTime: "5-10 min", imageUrl: "https://picsum.photos/400/300?random=408", isOpen247: true },
];

export const medicineProducts: MedicineProduct[] = [
    { id: 451, name: "Vitamin C Tablets (Limcee)", category: "Wellness", rating: 4.9, deliveryTime: "15 min", imageUrl: "https://picsum.photos/400/300?random=451", price: 25, unit: "15 tablets", description: "Boosts immunity and helps fight infections. Chewable tablets for daily health." },
    { id: 452, name: "Digital Thermometer", category: "Devices", rating: 4.8, deliveryTime: "20 min", imageUrl: "https://picsum.photos/400/300?random=452", price: 300, description: "Provides fast and accurate temperature readings. A must-have for every home." },
    { id: 453, name: "Band-Aid Pack", category: "First Aid", rating: 4.9, deliveryTime: "10 min", imageUrl: "https://picsum.photos/400/300?random=453", price: 50, description: "Waterproof and antiseptic bandages for minor cuts and scrapes." },
    { id: 454, name: "Protinex Supplement", category: "Fitness", rating: 4.7, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=454", price: 550, unit: "400 gm", description: "High-quality protein supplement for muscle growth and recovery." },
    { id: 455, name: "Dettol Antiseptic Liquid", category: "First Aid", rating: 4.9, deliveryTime: "12 min", imageUrl: "https://picsum.photos/400/300?random=455", price: 90, unit: "125 ml", description: "Multipurpose antiseptic liquid to clean cuts, wounds, and surfaces." },
    { id: 456, name: "Crocin Advance", category: "Pain Relief", rating: 4.8, deliveryTime: "10 min", imageUrl: "https://picsum.photos/400/300?random=456", price: 20, unit: "15 tablets", description: "Fast-acting relief from pain and fever." },
    { id: 457, name: "Moov Pain Relief Spray", category: "Pain Relief", rating: 4.7, deliveryTime: "15 min", imageUrl: "https://picsum.photos/400/300?random=457", price: 180, unit: "50 gm", description: "Instant relief from back pain, joint pain, and sprains." },
    { id: 458, name: "Digene Acidity & Gas Relief", category: "Digestive Health", rating: 4.8, deliveryTime: "12 min", imageUrl: "https://picsum.photos/400/300?random=458", price: 22, unit: "15 tablets", description: "Quickly neutralizes stomach acid to relieve heartburn and gas." },
    { id: 459, name: "Eno Fruit Salt", category: "Digestive Health", rating: 4.9, deliveryTime: "8 min", imageUrl: "https://picsum.photos/400/300?random=459", price: 55, unit: "100 gm", description: "Get relief from acidity in just 6 seconds." },
    { id: 460, name: "Vicks Vaporub", category: "Cold & Cough", rating: 4.8, deliveryTime: "10 min", imageUrl: "https://picsum.photos/400/300?random=460", price: 140, unit: "50 ml", description: "Relief from cough, cold, and blocked nose." },
    { id: 461, name: "Strepsils Lozenges", category: "Cold & Cough", rating: 4.7, deliveryTime: "10 min", imageUrl: "https://picsum.photos/400/300?random=461", price: 40, unit: "8 lozenges", description: "Soothing relief for a sore throat." },
    { id: 462, name: "Himalaya Neem Face Wash", category: "Skincare", rating: 4.8, deliveryTime: "18 min", imageUrl: "https://picsum.photos/400/300?random=462", price: 150, unit: "100 ml", description: "Pimple-clear, glowing skin with the power of neem." },
    { id: 463, name: "Nivea Moisturizer", category: "Skincare", rating: 4.7, deliveryTime: "20 min", imageUrl: "https://picsum.photos/400/300?random=463", price: 220, unit: "200 ml", description: "Provides long-lasting hydration for soft, supple skin." },
    { id: 464, name: "Johnson's Baby Powder", category: "Baby Care", rating: 4.9, deliveryTime: "20 min", imageUrl: "https://picsum.photos/400/300?random=464", price: 120, unit: "200 gm", description: "Clinically mildness-proven, gentle care for your baby's delicate skin." },
    { id: 465, name: "Pampers Diapers", category: "Baby Care", rating: 4.8, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=465", price: 350, unit: "22 pack", description: "Up to 12 hours of dryness for your baby's comfort." },
    { id: 466, name: "Accu-Chek Blood Glucose Meter", category: "Devices", rating: 4.9, deliveryTime: "30 min", imageUrl: "https://picsum.photos/400/300?random=466", price: 1200, unit: "1 kit", description: "Easy and accurate blood sugar monitoring at home." },
    { id: 467, name: "Revital H Capsules", category: "Wellness", rating: 4.7, deliveryTime: "20 min", imageUrl: "https://picsum.photos/400/300?random=467", price: 310, unit: "30 capsules", description: "A daily health supplement with vitamins, minerals, and ginseng." },
    { id: 468, name: "Electral Powder", category: "Wellness", rating: 4.8, deliveryTime: "10 min", imageUrl: "https://picsum.photos/400/300?random=468", price: 21, unit: "1 sachet", description: "Restores body fluids and electrolytes lost due to dehydration." },
    { id: 469, name: "Savlon Hand Sanitizer", category: "Personal Hygiene", rating: 4.9, deliveryTime: "12 min", imageUrl: "https://picsum.photos/400/300?random=469", price: 50, unit: "55 ml", description: "Kills 99.99% of germs without water." },
    { id: 470, name: "Opti-Free Contact Lens Solution", category: "Eye Care", rating: 4.8, deliveryTime: "25 min", imageUrl: "https://picsum.photos/400/300?random=470", price: 300, unit: "120 ml", description: "Cleans, rinses, and disinfects your contact lenses." },
];