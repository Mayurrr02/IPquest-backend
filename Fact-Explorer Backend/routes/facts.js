const express = require('express');
const router = express.Router();
const Fact = require('../models/Fact');

// @route   GET /api/facts
// @desc    Get all facts with filtering and sorting
// @route   GET /api/facts
// @desc    Get all facts with filtering, sorting, AND SEARCHing
router.get('/', async (req, res) => {
  try {
    const { ipr_type, domain, sort, search } = req.query; // 1. Get 'search' from URL
    let query = {};

    // 2. Add Filters
    if (ipr_type && ipr_type !== 'All') query.ipr_type = ipr_type;
    if (domain && domain !== 'All') query.domain = domain;

    // 3. Add Search Logic (New!)
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // 'i' means case-insensitive (A = a)
    }

    // 4. Sort
    let sortOptions = { year: -1 };
    if (sort === 'Oldest') sortOptions = { year: 1 };

    const facts = await Fact.find(query).sort(sortOptions);
    res.json(facts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/facts (🆕 THIS IS NEW)
// @desc    Create a new fact
router.post('/', async (req, res) => {
  const fact = new Fact({
    title: req.body.title,
    description: req.body.description,
    ipr_type: req.body.ipr_type,
    domain: req.body.domain,
    year: req.body.year,
    source: req.body.source
  });

  try {
    const newFact = await fact.save();
    res.status(201).json(newFact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   POST /api/facts/seed
// @desc    Add sample data
// @route   POST /api/facts/seed
// @desc    Reset the database with a HUGE list of facts
router.post('/seed', async (req, res) => {
  const hugeFactList = [
    // --- TECHNOLOGY ---
    { title: "The First Computer Mouse", description: "Douglas Engelbart patented the first computer mouse in 1970. It was a wooden shell with two metal wheels.", ipr_type: "Patent", domain: "Technology", year: 1970, source: "US Patent 3,541,541" },
    { title: "Amazon 1-Click", description: "Amazon held a controversial patent on '1-Click' buying from 1999 to 2017, forcing Apple to pay royalties to use it.", ipr_type: "Patent", domain: "Technology", year: 1999, source: "USPTO" },
    { title: "Google's PageRank", description: "The original algorithm for Google Search (PageRank) was patented by Stanford University, not Google itself.", ipr_type: "Patent", domain: "Technology", year: 1998, source: "Stanford Archives" },
    { title: "Bluetooth Name", description: "The name 'Bluetooth' is a tribute to King Harald Bluetooth. The logo is a combination of his runic initials.", ipr_type: "Trademark", domain: "Technology", year: 1998, source: "Ericsson" },
    { title: "iPhone Slide-to-Unlock", description: "Apple was granted a patent for the 'Slide-to-Unlock' gesture, which led to years of lawsuits with Samsung.", ipr_type: "Patent", domain: "Technology", year: 2011, source: "Apple v. Samsung" },

    // --- ENTERTAINMENT ---
    { title: "Mickey Mouse Copyright", description: "The original Mickey Mouse (Steamboat Willie) finally entered the public domain on January 1, 2024.", ipr_type: "Copyright", domain: "Entertainment", year: 2024, source: "US Copyright Office" },
    { title: "Happy Birthday Song", description: "Warner Music claimed to own the copyright to 'Happy Birthday' until a 2015 lawsuit proved it was in the public domain.", ipr_type: "Copyright", domain: "Entertainment", year: 2015, source: "LA Times" },
    { title: "The 'Bond' Chord", description: "The specific guitar chord used in James Bond films is not copyrighted, but the arrangement of the theme song is.", ipr_type: "Copyright", domain: "Entertainment", year: 1962, source: "EON Productions" },
    { title: "Metro-Goldwyn-Mayer Lion", description: "The roar of the MGM Lion is a trademarked sound. It was the first sound trademark ever registered for a film studio.", ipr_type: "Trademark", domain: "Entertainment", year: 1924, source: "MGM History" },
    { title: "Tetris Game Mechanics", description: "Tetris is famous for using copyright to protect its specific game mechanics and look, effectively stopping clones.", ipr_type: "Copyright", domain: "Entertainment", year: 1984, source: "Tetris Holding" },

    // --- BRANDS & TRADEMARKS ---
    { title: "Nike Swoosh", description: "Carolyn Davidson designed the Nike Swoosh for only $35 in 1971. It is now one of the most valuable logos on Earth.", ipr_type: "Trademark", domain: "Fashion", year: 1971, source: "Nike Inc." },
    { title: "Coca-Cola Bottle Shape", description: "The contour bottle shape is trademarked so you can identify it even if you feel it in the dark.", ipr_type: "Trademark", domain: "Food & Beverage", year: 1915, source: "Coca-Cola Co." },
    { title: "Tiffany Blue", description: "The specific shade of robin's-egg blue used by Tiffany & Co. is a registered trademark.", ipr_type: "Trademark", domain: "Fashion", year: 1998, source: "Pantone 1837" },
    { title: "Louboutin Red Soles", description: "Christian Louboutin holds a trademark for red soles on high-heeled shoes, provided the rest of the shoe isn't red.", ipr_type: "Trademark", domain: "Fashion", year: 2008, source: "EU Court of Justice" },
    { title: "Toblerone Shape", description: "The triangular shape of Toblerone chocolate is trademarked, protecting it from copycat candy bars.", ipr_type: "Trademark", domain: "Food & Beverage", year: 1909, source: "Swiss Federal Institute" },

    // --- TRADE SECRETS ---
    { title: "Coca-Cola Formula", description: "The recipe for Coca-Cola is one of the world's most famous trade secrets, kept in a vault in Atlanta.", ipr_type: "Trade Secret", domain: "Food & Beverage", year: 1886, source: "World of Coke" },
    { title: "KFC 11 Herbs & Spices", description: "Colonel Sanders' original recipe is a trade secret. The spice mix is produced in two different factories to keep it safe.", ipr_type: "Trade Secret", domain: "Food & Beverage", year: 1940, source: "KFC Corp." },
    { title: "Google Search Algorithm", description: "While the original PageRank was patented, the current, complex search algorithm is a closely guarded trade secret.", ipr_type: "Trade Secret", domain: "Technology", year: 2023, source: "Google Search Central" },
    { title: "WD-40 Formula", description: "The formula for WD-40 is not patented to avoid revealing the ingredients. It remains a trade secret.", ipr_type: "Trade Secret", domain: "Technology", year: 1953, source: "WD-40 Company" },
    { title: "New York Times Best Seller List", description: "The exact methodology for how books are ranked on this list is a trade secret.", ipr_type: "Trade Secret", domain: "Entertainment", year: 1931, source: "NYT" },

    // --- HEALTHCARE ---
    { title: "Penicillin Patent", description: "Alexander Fleming refused to patent Penicillin because he wanted it to be a gift to humanity.", ipr_type: "Patent", domain: "Healthcare", year: 1928, source: "Science Museum" },
    { title: "The First mRNA Vaccine", description: "Patents for mRNA technology laid the groundwork for the rapid development of COVID-19 vaccines.", ipr_type: "Patent", domain: "Healthcare", year: 2020, source: "Nature Journal" },
    { title: "Insulin Patent Sale", description: "The inventors of Insulin sold the patent for $1 to the University of Toronto to ensure affordable access.", ipr_type: "Patent", domain: "Healthcare", year: 1923, source: "Nobel Prize.org" },
    { title: "Viagra's Original Purpose", description: "Pfizer originally patented Sildenafil (Viagra) as a heart medication before discovering its other use.", ipr_type: "Patent", domain: "Healthcare", year: 1996, source: "Pfizer History" },
    { title: "EpiPen Patent", description: "The mechanism for the auto-injector (EpiPen) was patented, allowing Mylan to dominate the market for decades.", ipr_type: "Patent", domain: "Healthcare", year: 1977, source: "USPTO" }
  ];

  try {
    await Fact.deleteMany({}); // ⚠️ This clears old data so you don't get duplicates
    await Fact.insertMany(hugeFactList);
    res.json({ message: "Database updated with 25+ Facts!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;