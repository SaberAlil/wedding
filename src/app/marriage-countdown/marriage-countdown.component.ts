// marriage-countdown.component.ts (Enhanced Wedding Website)
import { 
  Component, 
  signal, 
  computed, 
  effect, 
  OnDestroy, 
  Inject, 
  PLATFORM_ID,
  OnInit 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Interfaces for type safety
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FloatingElement {
  id: number;
  left: number;
  delay: number;
}

interface Hotel {
  id: number;
  name: string;
  details: string;
  bookingLink: string;
}

interface Registry {
  id: number;
  name: string;
  url: string;
  logo: string;
}

@Component({
  selector: 'app-marriage-countdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marriage-countdown.component.html',
  styleUrls: ['./marriage-countdown.component.css']
})
export class MarriageCountdownComponent implements OnInit, OnDestroy {
  
  // 💕 Core Wedding Information - UPDATE THESE WITH YOUR DETAILS
  coupleNames = signal('Saber & Amani');
  weddingDate = signal(new Date('2025-08-22T22:00:00'));
  weddingLocation = signal('Mahdia, Tunisia');
  personalQuote = signal('Two souls, one heart, forever intertwined');
  weddingHashtag = signal('Saber&Amani2025');
  
  // 📖 Love Story Information
  firstMetDate = signal('March 15, 2019');
  firstMetStory = signal('We met at a cozy coffee shop in downtown where Saber was reading her favorite book and Amani couldn\'t help but ask about it. That conversation lasted for hours and led to our first date the very next weekend.');
  
  proposalDate = signal('December 24, 2023');
  proposalStory = signal('On Christmas Eve, under the twinkling lights of our favorite park, Amani got down on one knee and asked the question that would change our lives forever. Of course, Saber said yes!');
  
  // 🎉 Wedding Details
  ceremonyTime = signal('4:00 PM');
  ceremonyLocation = signal('Villa Bellacorte');
  ceremonyAddress = signal('Via Roma 123, Tuscany, Italy');
  
  receptionTime = signal('6:30 PM');
  receptionLocation = signal('Villa Bellacorte Gardens');
  receptionAddress = signal('Via Roma 123, Tuscany, Italy');
  
  dressCode = signal('Cocktail Attire');
  dressCodeNote = signal('Think elegant and comfortable for an outdoor celebration');
  
  // ✈️ Travel Information
  nearestAirport = signal('Florence Airport (FLR) - 45 minutes away');
  drivingInstructions = signal('Take A1 highway, exit at Valdichiana, follow signs to venue');
  parkingInfo = signal('Free parking available on-site');
  
  // 🏨 Recommended Hotels
  recommendedHotels = signal<Hotel[]>([
    {
      id: 1,
      name: 'Hotel Tuscany Dreams',
      details: 'Luxury hotel, 10 minutes from venue. Special rate: €120/night',
      bookingLink: 'https://booking.com/hotel-tuscany-dreams'
    },
    {
      id: 2,
      name: 'Villa Romantica B&B',
      details: 'Charming bed & breakfast, 15 minutes from venue. Rate: €80/night',
      bookingLink: 'https://booking.com/villa-romantica'
    }
  ]);
  
  // 🎁 Gift Registries
  giftRegistries = signal<Registry[]>([
    {
      id: 1,
      name: 'Amazon',
      url: 'https://amazon.com/wedding/registry/your-registry-id',
      logo: 'assets/amazon-logo.png'
    },
    {
      id: 2,
      name: 'Williams Sonoma',
      url: 'https://williams-sonoma.com/registry/your-registry',
      logo: 'assets/williams-sonoma-logo.png'
    },
    {
      id: 3,
      name: 'Honeymoon Fund',
      url: 'https://honeyfund.com/your-fund',
      logo: 'assets/honeyfund-logo.png'
    }
  ]);
  
  // ⏰ Time Management
  currentTime = signal(new Date());
  private isBrowser: boolean;
  
  // ✨ Animation Elements
  hearts = signal<FloatingElement[]>([]);
  
  // 🔄 Timer Management
  private intervalId: number | undefined;
  private heartGenerationInterval: number | undefined;

  // 🧮 Computed Properties
  formattedWeddingDate = computed(() => {
    const date = this.weddingDate();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
  
  timeLeft = computed((): TimeLeft => {
    const now = this.currentTime().getTime();
    const weddingTime = this.weddingDate().getTime();
    const difference = weddingTime - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  });

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.initializeAnimations();
    
    if (this.isBrowser) {
      this.startCountdown();
      this.startHeartGeneration();
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  // 🎯 Public Methods for Wedding Information

  /**
   * Get appropriate countdown message based on time remaining
   */
  getCountdownMessage(): string {
    const days = this.timeLeft().days;
    
    if (days === 0) return "It's our wedding day! 🎉";
    if (days === 1) return "Tomorrow we say 'I do'! 💍";
    if (days <= 7) return "Less than a week until we're married! 💕";
    if (days <= 30) return "One month until our forever begins! ✨";
    if (days <= 60) return "Two months to go - the excitement is building! 🥰";
    if (days <= 100) return "100 days or less - it's getting real! 💖";
    
    return "We can't wait to celebrate with you! 🌟";
  }

  /**
   * Update couple names
   */
  updateCoupleNames(names: string): void {
    this.coupleNames.set(names);
  }

  /**
   * Update wedding date
   */
  updateWeddingDate(date: Date): void {
    this.weddingDate.set(date);
  }

  // 🎁 Registry Methods

  /**
   * Add gift registry
   */
  addRegistry(registry: Registry): void {
    const currentRegistries = this.giftRegistries();
    this.giftRegistries.set([...currentRegistries, registry]);
  }

  /**
   * Remove gift registry
   */
  removeRegistry(registryId: number): void {
    const currentRegistries = this.giftRegistries();
    this.giftRegistries.set(currentRegistries.filter(r => r.id !== registryId));
  }

  // 🏨 Hotel Methods

  /**
   * Add recommended hotel
   */
  addHotel(hotel: Hotel): void {
    const currentHotels = this.recommendedHotels();
    this.recommendedHotels.set([...currentHotels, hotel]);
  }

  // 🔧 Private Methods

  private startCountdown(): void {
    if (!this.isBrowser) return;
    
    this.updateCurrentTime();
    this.intervalId = window.setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  }

  private updateCurrentTime(): void {
    if (this.isBrowser) {
      this.currentTime.set(new Date());
    }
  }

  private initializeAnimations(): void {
    this.generateHearts();
  }

  private generateHearts(): void {
    const heartArray: FloatingElement[] = [];
    for (let i = 0; i < 15; i++) {
      heartArray.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15
      });
    }
    this.hearts.set(heartArray);
  }

  private startHeartGeneration(): void {
    if (!this.isBrowser) return;
    
    // Add new hearts every 45 seconds
    this.heartGenerationInterval = window.setInterval(() => {
      this.addNewHeart();
    }, 45000);
  }

  private addNewHeart(): void {
    const currentHearts = this.hearts();
    const newHeart: FloatingElement = {
      id: Date.now(),
      left: Math.random() * 100,
      delay: 0
    };
    
    // Keep only the last 20 hearts to prevent memory issues
    const updatedHearts = [...currentHearts, newHeart].slice(-20);
    this.hearts.set(updatedHearts);
  }

  private celebrateWeddingDay(): void {
    if (!this.isBrowser) return;
    
    console.log('🎉 Congratulations! It\'s your wedding day!');
    
    // Add celebration hearts
    const celebrationHearts: FloatingElement[] = [];
    for (let i = 0; i < 30; i++) {
      celebrationHearts.push({
        id: Date.now() + i,
        left: Math.random() * 100,
        delay: Math.random() * 5
      });
    }
    
    const currentHearts = this.hearts();
    this.hearts.set([...currentHearts, ...celebrationHearts]);
  }

  private cleanup(): void {
    if (this.intervalId && this.isBrowser) {
      clearInterval(this.intervalId);
    }
    
    if (this.heartGenerationInterval && this.isBrowser) {
      clearInterval(this.heartGenerationInterval);
    }
  }

  // 🎨 Utility Methods for Template

  /**
   * Get urgency class for styling based on days remaining
   */
  getUrgencyClass(): string {
    const days = this.timeLeft().days;
    if (days === 0) return 'wedding-day';
    if (days <= 1) return 'very-urgent';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'soon';
    return 'normal';
  }

  /**
   * Format time unit with leading zero if needed
   */
  formatTimeUnit(value: number): string {
    return value.toString().padStart(2, '0');
  }

  /**
   * Check if wedding has passed
   */
  isWeddingPast(): boolean {
    return this.weddingDate().getTime() < new Date().getTime();
  }

  /**
   * Get days until wedding (for external use)
   */
  getDaysUntilWedding(): number {
    return this.timeLeft().days;
  }

  /**
   * Scroll to section (for navigation)
   */
  scrollToSection(sectionId: string): void {
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}