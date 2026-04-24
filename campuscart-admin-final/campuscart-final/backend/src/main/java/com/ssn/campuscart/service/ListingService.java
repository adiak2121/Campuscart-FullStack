package com.ssn.campuscart.service;

import com.ssn.campuscart.model.Listing;
import com.ssn.campuscart.payload.ListingRequest;
import com.ssn.campuscart.repository.ListingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListingService implements CommandLineRunner {

    private final ListingRepository listingRepository;

    public ListingService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public List<Listing> getAll() {
        return listingRepository.findAll();
    }

    // PART 3: Price filter
    public List<Listing> filterByPrice(Double min, Double max) {
        return listingRepository.findAll()
                .stream()
                .filter(l -> l.getPrice() >= min && l.getPrice() <= max)
                .collect(Collectors.toList());
    }

    public Listing create(ListingRequest request) {
        Listing listing = Listing.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .sellerName(request.getSellerName())
                .sellerEmail(request.getSellerEmail())
                .sellerBadge("Trusted Seller")
                .rating(4.7)
                .pickupLocation(request.getPickupLocation())
                .pickupSlot(request.getPickupSlot())
                .dailySpecial(Boolean.TRUE.equals(request.getDailySpecial()))
                .featured(true)
                .createdAt(Instant.now())   // PART 1: set createdAt
                .build();

        return listingRepository.save(listing);
    }

    @Override
    public void run(String... args) {
        seedIfMissing(
                "Mom's Lemon Rice Lunch Box", "Food",
                "Fresh homemade lunch packed in the morning for students who want a lighter meal.",
                85.0,
                "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
                "Harini S", "harini@ssn.edu.in", "Top Food Seller", 4.9,
                "Main Cafeteria", "12:30 PM - 1:00 PM", true, true
        );

        seedIfMissing(
                "Mini Brownie Box", "Food",
                "Soft homemade brownies baked fresh for evening cravings between classes.",
                70.0,
                "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
                "Nivetha M", "nivetha@ssn.edu.in", "Top Food Seller", 4.8,
                "Admin Block", "4:30 PM - 5:00 PM", true, true
        );

        seedIfMissing(
                "Curd Rice Combo", "Food",
                "Simple comfort meal packed with homemade flavor and a student-friendly price.",
                90.0,
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
                "Meena J", "meena@ssn.edu.in", "Trusted Food Seller", 4.8,
                "Main Cafeteria", "12:30 PM - 1:00 PM", true, false
        );

        seedIfMissing(
                "Stationery Starter Kit", "Stationery",
                "Pens, sticky notes, highlighter, and mini notepad for daily class use.",
                120.0,
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
                "Pranav K", "pranav@ssn.edu.in", "Trusted Seller", 4.6,
                "Library Gate", "1:00 PM - 1:30 PM", false, true
        );

        seedIfMissing(
                "Blue Journal Pack", "Stationery",
                "Clean ruled journal with planner stickers and bookmark tabs.",
                140.0,
                "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
                "Keerthi P", "keerthi@ssn.edu.in", "Academic Seller", 4.7,
                "Library Gate", "5:00 PM - 5:30 PM", false, false
        );

        seedIfMissing(
                "Exam Highlighter Set", "Stationery",
                "Pastel highlighters and quick-note slips for revision sessions.",
                95.0,
                "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
                "Mithra V", "mithra@ssn.edu.in", "Trusted Seller", 4.7,
                "Admin Block", "4:30 PM - 5:00 PM", false, false
        );

        seedIfMissing(
                "DBMS Unit Notes Bundle", "Textbooks",
                "A useful revision bundle for internals with neat notes and summary sheets.",
                60.0,
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
                "Gokul R", "gokul@ssn.edu.in", "Trusted Seller", 4.8,
                "Library Gate", "4:30 PM - 5:00 PM", false, true
        );

        seedIfMissing(
                "Engineering Mathematics Textbook", "Textbooks",
                "Second-hand but neat condition, ideal for first-year reference and practice.",
                220.0,
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
                "Sanjay R", "sanjay@ssn.edu.in", "Academic Seller", 4.7,
                "Library Gate", "1:00 PM - 1:30 PM", false, true
        );

        seedIfMissing(
                "Java Placement Prep Flashcards", "Textbooks",
                "Quick revision cards covering OOP, collections, and common interview basics.",
                55.0,
                "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1200&q=80",
                "Rahul T", "rahul@ssn.edu.in", "Academic Seller", 4.7,
                "Library Gate", "5:00 PM - 5:30 PM", false, false
        );

        seedIfMissing(
                "Blue Oversized Hoodie", "Clothing",
                "Comfortable campus hoodie in a clean blue tone, easy for everyday wear.",
                480.0,
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
                "Diya L", "diya@ssn.edu.in", "Style Seller", 4.8,
                "Hostel Lobby", "5:00 PM - 5:30 PM", false, true
        );

        seedIfMissing(
                "Casual White Tee", "Clothing",
                "Minimal solid tee in good condition, perfect for simple campus outfits.",
                180.0,
                "https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1200&q=80",
                "Lavanya M", "lavanya@ssn.edu.in", "Style Seller", 4.6,
                "Hostel Lobby", "4:30 PM - 5:00 PM", false, false
        );

        seedIfMissing(
                "Denim Campus Jacket", "Clothing",
                "Light jacket with a casual fit, nice for evening events and club meets.",
                550.0,
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
                "Akhil S", "akhil@ssn.edu.in", "Trusted Seller", 4.7,
                "Admin Block", "5:00 PM - 5:30 PM", false, false
        );

        seedIfMissing(
                "Blue Crochet Keychain", "Accessories",
                "Cute handmade keychain designed in campus colors and easy to gift.",
                95.0,
                "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
                "Deepika V", "deepika@ssn.edu.in", "Handmade Seller", 4.8,
                "Main Cafeteria", "1:00 PM - 1:30 PM", false, true
        );

        seedIfMissing(
                "Classic Wrist Watch", "Accessories",
                "Simple analog watch with a clean campus-friendly look for daily use.",
                1000.0,
                "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
                "Arun P", "arun@ssn.edu.in", "Trusted Seller", 4.7,
                "Main Cafeteria", "12:30 PM - 1:00 PM", false, false
        );

        seedIfMissing(
                "Minimal Tote Bag", "Accessories",
                "Reusable tote for books, laptop accessories, and day-to-day campus carry.",
                210.0,
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
                "Shruthi P", "shruthi@ssn.edu.in", "Handmade Seller", 4.7,
                "Main Cafeteria", "1:00 PM - 1:30 PM", false, false
        );
    }

    private void seedIfMissing(
            String title, String category, String description, Double price,
            String imageUrl, String sellerName, String sellerEmail,
            String sellerBadge, Double rating, String pickupLocation,
            String pickupSlot, Boolean dailySpecial, Boolean featured
    ) {
        boolean exists = listingRepository.findAll()
                .stream()
                .anyMatch(item -> title.equalsIgnoreCase(item.getTitle()));

        if (!exists) {
            listingRepository.save(
                    Listing.builder()
                            .title(title)
                            .category(category)
                            .description(description)
                            .price(price)
                            .imageUrl(imageUrl)
                            .sellerName(sellerName)
                            .sellerEmail(sellerEmail)
                            .sellerBadge(sellerBadge)
                            .rating(rating)
                            .pickupLocation(pickupLocation)
                            .pickupSlot(pickupSlot)
                            .dailySpecial(dailySpecial)
                            .featured(featured)
                            .createdAt(Instant.now())   // seed data also gets createdAt
                            .build()
            );
        }
    }
}