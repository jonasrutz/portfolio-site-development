// Customization System Model
// This manages all available cosmetic items, purchases, and selections

const customizationSystem = {
    // Star designs that players can unlock and apply
    starDesigns: {
        'classic-star': {
            id: 'classic-star',
            name: 'Classic Star',
            description: 'The original star design',
            icon: 'fas fa-sun',
            cost: 0, // Free/default
            owned: true, // Default is owned
            selected: true, // Default is selected
            unlockRequirement: null // No requirement
        },
        'neutron-star': {
            id: 'neutron-star',
            name: 'Neutron Star',
            description: 'A dense, collapsed stellar remnant',
            icon: 'fas fa-atom',
            cost: 100,
            owned: false,
            selected: false,
            unlockRequirement: null
        },
        'binary-star': {
            id: 'binary-star',
            name: 'Binary Star',
            description: 'Two stars orbiting each other',
            icon: 'fas fa-sun',
            cost: 250,
            owned: false,
            selected: false,
            unlockRequirement: null
        },
        'supernova': {
            id: 'supernova',
            name: 'Supernova',
            description: 'An exploding star with immense energy',
            icon: 'fas fa-radiation',
            cost: 500,
            owned: false,
            selected: false,
            unlockRequirement: 'achievement:first-ascension'
        },
        'pulsar-star': {
            id: 'pulsar-star',
            name: 'Pulsar Star',
            description: 'A rapidly rotating neutron star',
            icon: 'fas fa-compact-disc',
            cost: 750,
            owned: false,
            selected: false,
            unlockRequirement: 'achievement:second-ascension'
        }
    },
    
    // Background themes that change the game's appearance
    backgrounds: {
        'deep-space': {
            id: 'deep-space',
            name: 'Deep Space',
            description: 'The void of space, with distant stars',
            icon: 'fas fa-moon',
            cost: 0, // Free/default
            owned: true, // Default is owned
            selected: true, // Default is selected
            unlockRequirement: null // No requirement
        },
        'nebula-clouds': {
            id: 'nebula-clouds',
            name: 'Nebula Clouds',
            description: 'Colorful cosmic clouds of gas and dust',
            icon: 'fas fa-cloud',
            cost: 150,
            owned: false,
            selected: false,
            unlockRequirement: null
        },
        'star-cluster': {
            id: 'star-cluster',
            name: 'Star Cluster',
            description: 'A dense field of stars',
            icon: 'fas fa-sparkles',
            cost: 300,
            owned: false,
            selected: false,
            unlockRequirement: null
        },
        'galactic-core': {
            id: 'galactic-core',
            name: 'Galactic Core',
            description: 'The bright center of a galaxy',
            icon: 'fas fa-star-of-life',
            cost: 600,
            owned: false,
            selected: false,
            unlockRequirement: 'achievement:third-prestige'
        },
        'cosmic-void': {
            id: 'cosmic-void',
            name: 'Cosmic Void',
            description: 'The emptiness between universes',
            icon: 'fas fa-circle',
            cost: 1000,
            owned: false,
            selected: false,
            unlockRequirement: 'achievement:fourth-prestige'
        }
    },
    
    // Particle effects for clicks
    particleEffects: {
        'starburst': {
            id: 'starburst',
            name: 'Starburst',
            description: 'Classic star particles',
            icon: 'fas fa-star',
            cost: 0, // Free/default
            owned: true, // Default is owned
            selected: true, // Default is selected
            unlockRequirement: null // No requirement
        },
        'cosmic-rays': {
            id: 'cosmic-rays',
            name: 'Cosmic Rays',
            description: 'Bright beams of energy',
            icon: 'fas fa-bolt',
            cost: 200,
            owned: false,
            selected: false,
            unlockRequirement: null
        },
        'galaxy-swirl': {
            id: 'galaxy-swirl',
            name: 'Galaxy Swirl',
            description: 'Particles that orbit in a spiral',
            icon: 'fas fa-spinner',
            cost: 400,
            owned: false,
            selected: false,
            unlockRequirement: null
        },
        'constellation': {
            id: 'constellation',
            name: 'Constellation',
            description: 'Connected stars that form patterns',
            icon: 'fas fa-project-diagram',
            cost: 800,
            owned: false,
            selected: false,
            unlockRequirement: 'achievement:second-prestige'
        },
        'wormhole': {
            id: 'wormhole',
            name: 'Wormhole',
            description: 'A tunnel through spacetime',
            icon: 'fas fa-circle-notch',
            cost: 1200,
            owned: false,
            selected: false,
            unlockRequirement: 'achievement:fifth-prestige'
        }
    },
    
    // Purchase a cosmetic item with cosmic dust
    purchaseCosmetic: function(type, id, availableDust) {
        let collection;
        
        // Determine which collection to use
        switch (type) {
            case 'star-design':
                collection = this.starDesigns;
                break;
            case 'background':
                collection = this.backgrounds;
                break;
            case 'particle-effect':
                collection = this.particleEffects;
                break;
            default:
                return {
                    success: false,
                    message: 'Invalid cosmetic type',
                    dustLeft: availableDust
                };
        }
        
        // Check if the item exists
        const item = collection[id];
        if (!item) {
            return {
                success: false,
                message: 'Item not found',
                dustLeft: availableDust
            };
        }
        
        // Check if already owned
        if (item.owned) {
            return {
                success: false,
                message: 'You already own this item',
                dustLeft: availableDust
            };
        }
        
        // Check if requirements are met
        if (item.unlockRequirement && !this.checkUnlockRequirement(item.unlockRequirement)) {
            return {
                success: false,
                message: 'You have not met the requirements to unlock this item',
                dustLeft: availableDust
            };
        }
        
        // Check if we can afford it
        if (availableDust < item.cost) {
            return {
                success: false,
                message: 'Not enough Cosmic Dust',
                dustLeft: availableDust
            };
        }
        
        // Purchase the item
        item.owned = true;
        const dustLeft = availableDust - item.cost;
        
        return {
            success: true,
            message: `Successfully purchased ${item.name}!`,
            dustLeft: dustLeft
        };
    },
    
    // Select a cosmetic item to use
    selectCosmetic: function(type, id) {
        let collection;
        let property;
        
        // Determine which collection to use
        switch (type) {
            case 'star-design':
                collection = this.starDesigns;
                property = 'starDesign';
                break;
            case 'background':
                collection = this.backgrounds;
                property = 'background';
                break;
            case 'particle-effect':
                collection = this.particleEffects;
                property = 'particleEffect';
                break;
            default:
                return {
                    success: false,
                    message: 'Invalid cosmetic type'
                };
        }
        
        // Check if the item exists
        const item = collection[id];
        if (!item) {
            return {
                success: false,
                message: 'Item not found'
            };
        }
        
        // Check if owned
        if (!item.owned) {
            return {
                success: false,
                message: 'You do not own this item'
            };
        }
        
        // Deselect all items in this category
        Object.values(collection).forEach(i => i.selected = false);
        
        // Select this item
        item.selected = true;
        
        return {
            success: true,
            message: `${item.name} selected!`
        };
    },
    
    // Check if an unlock requirement is met
    checkUnlockRequirement: function(requirement) {
        if (!requirement) return true;
        
        // Parse the requirement string (format: 'type:id')
        const [type, id] = requirement.split(':');
        
        switch (type) {
            case 'achievement':
                // Check if the achievement is earned
                if (gameState.achievements && gameState.achievements[id]) {
                    return gameState.achievements[id].earned;
                }
                return false;
                
            case 'level':
                // Check if player level is high enough
                const requiredLevel = parseInt(id);
                return gameState.level >= requiredLevel;
                
            case 'prestige':
                // Check if prestige level is high enough
                const requiredPrestige = parseInt(id);
                return gameState.prestigeLevel >= requiredPrestige;
                
            default:
                return false;
        }
    },
    
    // Get all cosmetic items that are available to purchase/view
    getAvailableCosmetics: function() {
        // Returns all cosmetics that either don't have a requirement,
        // or have a requirement that is met
        const result = {
            starDesigns: {},
            backgrounds: {},
            particleEffects: {}
        };
        
        // Filter star designs
        Object.values(this.starDesigns).forEach(item => {
            if (!item.unlockRequirement || this.checkUnlockRequirement(item.unlockRequirement)) {
                result.starDesigns[item.id] = item;
            }
        });
        
        // Filter backgrounds
        Object.values(this.backgrounds).forEach(item => {
            if (!item.unlockRequirement || this.checkUnlockRequirement(item.unlockRequirement)) {
                result.backgrounds[item.id] = item;
            }
        });
        
        // Filter particle effects
        Object.values(this.particleEffects).forEach(item => {
            if (!item.unlockRequirement || this.checkUnlockRequirement(item.unlockRequirement)) {
                result.particleEffects[item.id] = item;
            }
        });
        
        return result;
    },
    
    // Get the selected cosmetics
    getSelectedCosmetics: function() {
        return {
            starDesign: Object.values(this.starDesigns).find(item => item.selected) || this.starDesigns['classic-star'],
            background: Object.values(this.backgrounds).find(item => item.selected) || this.backgrounds['deep-space'],
            particleEffect: Object.values(this.particleEffects).find(item => item.selected) || this.particleEffects['starburst']
        };
    },
    
    // Convert the system state to a JSON-compatible object for saving
    toJSON: function() {
        return {
            starDesigns: this.starDesigns,
            backgrounds: this.backgrounds,
            particleEffects: this.particleEffects
        };
    },
    
    // Load the system state from a saved object
    fromJSON: function(json) {
        if (!json) return;
        
        // Helper function to merge saved data with current data
        const mergeData = (current, saved) => {
            for (const id in current) {
                if (saved[id]) {
                    current[id].owned = saved[id].owned || current[id].owned;
                    current[id].selected = saved[id].selected || current[id].selected;
                }
            }
        };
        
        // Merge saved data
        if (json.starDesigns) {
            mergeData(this.starDesigns, json.starDesigns);
        }
        
        if (json.backgrounds) {
            mergeData(this.backgrounds, json.backgrounds);
        }
        
        if (json.particleEffects) {
            mergeData(this.particleEffects, json.particleEffects);
        }
    }
};