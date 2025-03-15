// src/services/location/CourtLocatorService.js
/**
 * Service for finding and retrieving court location information
 */
class CourtLocatorService {
    constructor() {
      this.courts = {};
      this.initialized = false;
    }
    
    /**
     * Initialize the court data
     * @returns {Promise<void>}
     */
    async initialize() {
      if (this.initialized) return;
      
      try {
        // In a real app, this would load court data from an API or database
        // For this example, we'll use hardcoded data
        this.courts = this.getCourtData();
        this.initialized = true;
      } catch (error) {
        console.error('Error initializing court locator service:', error);
        throw error;
      }
    }
    
    /**
     * Get court locations filtered by province and court type
     * @param {string} province - Province/territory 
     * @param {string} courtType - Type of court (e.g., 'Family', 'Civil', etc.)
     * @param {string} jurisdiction - Jurisdiction (e.g., 'Provincial', 'Superior', etc.)
     * @returns {Promise<Array>} - Matching court locations
     */
    async getCourtLocations(province, courtType = null, jurisdiction = null) {
      await this.initialize();
      
      // Get courts for the specified province
      const provinceCourts = this.courts[province] || [];
      
      // Filter by court type and jurisdiction if specified
      return provinceCourts.filter(court => {
        const matchesType = !courtType || court.courtTypes.includes(courtType);
        const matchesJurisdiction = !jurisdiction || court.jurisdiction === jurisdiction;
        return matchesType && matchesJurisdiction;
      });
    }
    
    /**
     * Find the nearest court to a location
     * @param {Object} userLocation - User's location {latitude, longitude}
     * @param {string} province - Province/territory
     * @param {string} courtType - Type of court
     * @returns {Promise<Object>} - Nearest court location
     */
    async findNearestCourt(userLocation, province, courtType = null) {
      if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
        throw new Error('Valid user location is required');
      }
      
      // Get filtered court locations
      const courts = await this.getCourtLocations(province, courtType);
      
      if (courts.length === 0) {
        return null;
      }
      
      // Calculate distance to each court
      const courtsWithDistance = courts.map(court => {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          court.latitude,
          court.longitude
        );
        
        return { ...court, distance };
      });
      
      // Sort by distance and return the nearest
      courtsWithDistance.sort((a, b) => a.distance - b.distance);
      return courtsWithDistance[0];
    }
    
    /**
     * Calculate distance between two points using Haversine formula
     * @param {number} lat1 - Latitude of point 1
     * @param {number} lon1 - Longitude of point 1
     * @param {number} lat2 - Latitude of point 2
     * @param {number} lon2 - Longitude of point 2
     * @returns {number} - Distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in kilometers
      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon2 - lon1);
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
        
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }
    
    /**
     * Convert degrees to radians
     * @param {number} degrees - Angle in degrees
     * @returns {number} - Angle in radians
     */
    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
    
    /**
     * Get a court by ID
     * @param {string} courtId - Court ID
     * @returns {Promise<Object>} - Court location
     */
    async getCourtById(courtId) {
      await this.initialize();
      
      // Search for the court across all provinces
      for (const province in this.courts) {
        const court = this.courts[province].find(c => c.id === courtId);
        if (court) {
          return court;
        }
      }
      
      return null;
    }
    
    /**
     * Search for courts by name or city
     * @param {string} query - Search query
     * @param {string} province - Optional province filter
     * @returns {Promise<Array>} - Matching court locations
     */
    async searchCourts(query, province = null) {
      await this.initialize();
      
      if (!query || query.trim().length === 0) {
        return [];
      }
      
      const searchTerm = query.toLowerCase();
      let results = [];
      
      // Get courts for the specified province or all provinces
      const provinces = province ? [province] : Object.keys(this.courts);
      
      provinces.forEach(prov => {
        const matchingCourts = this.courts[prov].filter(court => 
          court.name.toLowerCase().includes(searchTerm) ||
          court.city.toLowerCase().includes(searchTerm)
        );
        
        results = [...results, ...matchingCourts];
      });
      
      return results;
    }
    
    /**
     * Get court data for all provinces
     * @returns {Object} - Court data organized by province
     */
    getCourtData() {
      return {
        "New Brunswick": [
          {
            id: "nb-sj-family",
            name: "Saint John Family Division",
            jurisdiction: "Court of King's Bench",
            courtTypes: ["Family"],
            address: "110 Charlotte Street, Saint John, NB E2L 2J4",
            phone: "(506) 658-2400",
            email: "family.saintjohn@gnb.ca",
            website: "https://www.gnb.ca/courtofqueensbench",
            latitude: 45.274,
            longitude: -66.059,
            city: "Saint John",
            province: "New Brunswick",
            postalCode: "E2L 2J4",
            hours: "Monday to Friday, 8:30 AM - 4:30 PM",
            languages: ["English", "French"],
            services: [
              "Family law proceedings",
              "Divorce applications",
              "Child custody",
              "Child support",
              "Spousal support"
            ],
            accessibility: {
              wheelchairAccessible: true,
              hearingAssistance: true,
              visualAssistance: false
            }
          },
          {
            id: "nb-fred-family",
            name: "Fredericton Family Division",
            jurisdiction: "Court of King's Bench",
            courtTypes: ["Family"],
            address: "427 Queen Street, Fredericton, NB E3B 1B6",
            phone: "(506) 453-2015",
            email: "family.fredericton@gnb.ca",
            website: "https://www.gnb.ca/courtofqueensbench",
            latitude: 45.964,
            longitude: -66.643,
            city: "Fredericton",
            province: "New Brunswick",
            postalCode: "E3B 1B6",
            hours: "Monday to Friday, 8:30 AM - 4:30 PM",
            languages: ["English", "French"],
            services: [
              "Family law proceedings",
              "Divorce applications",
              "Child custody",
              "Child support",
              "Spousal support"
            ],
            accessibility: {
              wheelchairAccessible: true,
              hearingAssistance: true,
              visualAssistance: true
            }
          },
          {
            id: "nb-monc-family",
            name: "Moncton Family Division",
            jurisdiction: "Court of King's Bench",
            courtTypes: ["Family"],
            address: "145 Assumption Blvd, Moncton, NB E1C 0R2",
            phone: "(506) 856-2304",
            email: "family.moncton@gnb.ca",
            website: "https://www.gnb.ca/courtofqueensbench",
            latitude: 46.089,
            longitude: -64.776,
            city: "Moncton",
            province: "New Brunswick",
            postalCode: "E1C 0R2",
            hours: "Monday to Friday, 8:30 AM - 4:30 PM",
            languages: ["English", "French"],
            services: [
              "Family law proceedings",
              "Divorce applications",
              "Child custody",
              "Child support",
              "Spousal support"
            ],
            accessibility: {
              wheelchairAccessible: true,
              hearingAssistance: true,
              visualAssistance: false
            }
          }
        ],
        "Ontario": [
          {
            id: "on-toronto-family",
            name: "Toronto Superior Court of Justice - Family Court",
            jurisdiction: "Superior Court of Justice",
            courtTypes: ["Family"],
            address: "393 University Avenue, 10th Floor, Toronto, ON M5G 1E6",
            phone: "(416) 327-2064",
            email: "toronto.scj.family@ontario.ca",
            website: "https://www.ontariocourts.ca/scj/family",
            latitude: 43.655,
            longitude: -79.388,
            city: "Toronto",
            province: "Ontario",
            postalCode: "M5G 1E6",
            hours: "Monday to Friday, 8:30 AM - 5:00 PM",
            languages: ["English", "French"],
            services: [
              "Family law proceedings",
              "Divorce applications",
              "Child custody",
              "Child support",
              "Spousal support",
              "Property division"
            ],
            accessibility: {
              wheelchairAccessible: true,
              hearingAssistance: true,
              visualAssistance: true
            }
          },
          {
            id: "on-ottawa-family",
            name: "Ottawa Superior Court of Justice - Family Court",
            jurisdiction: "Superior Court of Justice",
            courtTypes: ["Family"],
            address: "161 Elgin Street, Ottawa, ON K2P 2K1",
            phone: "(613) 239-1274",
            email: "ottawa.scj.family@ontario.ca",
            website: "https://www.ontariocourts.ca/scj/family",
            latitude: 45.420,
            longitude: -75.691,
            city: "Ottawa",
            province: "Ontario",
            postalCode: "K2P 2K1",
            hours: "Monday to Friday, 8:30 AM - 5:00 PM",
            languages: ["English", "French"],
            services: [
              "Family law proceedings",
              "Divorce applications",
              "Child custody",
              "Child support",
              "Spousal support",
              "Property division"
            ],
            accessibility: {
              wheelchairAccessible: true,
              hearingAssistance: true,
              visualAssistance: true
            }
          }
        ],
        "Quebec": [
          {
            id: "qc-montreal-family",
            name: "Montreal Superior Court - Family Division",
            jurisdiction: "Superior Court",
            courtTypes: ["Family"],
            address: "1 Notre-Dame Street East, Montreal, QC H2Y 1B6",
            phone: "(514) 393-2535",
            email: "montreal.family@justice.gouv.qc.ca",
            website: "https://www.justice.gouv.qc.ca",
            latitude: 45.508,
            longitude: -73.555,
            city: "Montreal",
            province: "Quebec",
            postalCode: "H2Y 1B6",
            hours: "Monday to Friday, 8:30 AM - 4:30 PM",
            languages: ["French", "English"],
            services: [
              "Family law proceedings",
              "Divorce applications",
              "Child custody",
              "Child support",
              "Spousal support",
              "Property division"
            ],
            accessibility: {
              wheelchairAccessible: true,
              hearingAssistance: true,
              visualAssistance: false
            }
          },
          {
            id: "qc-quebec-family",
            name: "Quebec City Superior Court - Family Division",
            jurisdiction: "Superior Court",
            courtTypes: ["Family"],
            address: "300 Jean-Lesage Boulevard, Quebec City, QC G1K 8K6",
            phone: "(418) 649-3400",
            email: "quebec.family@justice.gouv.qc.ca",
            website: "https://www.justice.gouv.qc.ca",
            latitude: 46.816,
            longitude: -71.217,
            city: "Quebec City",
            province: "Quebec",
            postalCode: "G1K 8K6",
            hours: "Monday to Friday, 8:30 AM - 4:30 PM",
            languages: ["French", "English"],
            services: [
              "Family law proceedings",
              "Divorce applications",
              "Child custody",
              "Child support",
              "Spousal support",
              "Property division"
            ],
            accessibility: {
              wheelchairAccessible: true,
              hearingAssistance: true,
              visualAssistance: false
            }
          }
        ]
        // Additional provinces would be added here...
      };
    }
    
    /**
     * Get filing fees for a court
     * @param {string} courtId - Court ID
     * @param {string} formType - Type of form being filed
     * @returns {Promise<Object>} - Filing fee information
     */
    async getFilingFees(courtId, formType) {
      const court = await this.getCourtById(courtId);
      if (!court) {
        throw new Error(`Court not found: ${courtId}`);
      }
      
      // In a real application, this would come from a database or API
      // For this example, we'll return mock data based on province and form type
      const province = court.province;
      const feeData = this.getFilingFeeData(province, formType);
      
      return {
        court: court.name,
        formType,
        fee: feeData.fee,
        currency: 'CAD',
        paymentMethods: feeData.paymentMethods,
        feeWaiverAvailable: feeData.feeWaiverAvailable,
        notes: feeData.notes
      };
    }
    
    /**
     * Get filing fee data
     * @param {string} province - Province
     * @param {string} formType - Type of form
     * @returns {Object} - Fee data
     */
    getFilingFeeData(province, formType) {
      const feesData = {
        "New Brunswick": {
          "divorce": {
            fee: 120.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available based on financial need"
          },
          "custody": {
            fee: 80.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available based on financial need"
          },
          "support": {
            fee: 80.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available based on financial need"
          },
          "property": {
            fee: 100.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available based on financial need"
          }
        },
        "Ontario": {
          "divorce": {
            fee: 157.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available through Fee Waiver Request"
          },
          "custody": {
            fee: 102.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available through Fee Waiver Request"
          },
          "support": {
            fee: 102.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available through Fee Waiver Request"
          },
          "property": {
            fee: 202.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available through Fee Waiver Request"
          }
        },
        "Quebec": {
          "divorce": {
            fee: 302.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available for low-income applicants"
          },
          "custody": {
            fee: 103.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available for low-income applicants"
          },
          "support": {
            fee: 103.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available for low-income applicants"
          },
          "property": {
            fee: 208.00,
            paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
            feeWaiverAvailable: true,
            notes: "Fee waiver available for low-income applicants"
          }
        }
      };
      
      // If province or form type not found, return default values
      if (!feesData[province] || !feesData[province][formType]) {
        return {
          fee: 100.00,
          paymentMethods: ["Credit Card", "Debit Card", "Money Order"],
          feeWaiverAvailable: true,
          notes: "Fee waiver may be available based on financial need"
        };
      }
      
      return feesData[province][formType];
    }
  }
  
  export default new CourtLocatorService();