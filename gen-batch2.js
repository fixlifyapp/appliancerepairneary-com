/**
 * Batch 2 Generator — 10 neighbourhoods × 5 services = 50 pages
 * Run: node gen-batch2.js
 */
const fs = require('fs');
const path = require('path');

const PHONE = '(437) 524-1053';
const PHONE_LINK = '+14375241053';
const DOMAIN = 'https://appliancerepairneary.com';
const DATE = '2026-02-23';

// ─── NEIGHBOURHOODS ───────────────────────────────────────
const neighbourhoods = [
  {
    slug: 'parkdale',
    name: 'Parkdale',
    region: 'West Toronto',
    description: 'a gentrifying West Toronto neighbourhood along Queen Street West between Dufferin and Roncesvalles',
    housing: 'Victorian row houses divided into apartments, pre-war duplexes, and mid-rise condo conversions along King Street West',
    era: '1880s–1920s Victorian and Edwardian homes, many subdivided into multi-unit apartments during the 1970s and 1980s',
    brands: 'Whirlpool, GE, and Frigidaire in older rental units; Samsung and LG in renovated owner-occupied homes',
    waterNote: 'Parkdale sits on the original City of Toronto water main grid. Buildings with original galvanized supply lines experience higher sediment loads that accelerate inlet valve solenoid wear.',
    subAreas: ['Queen-Dufferin corridor', 'South Parkdale near the lake', 'Jameson Avenue', 'Cowan Avenue', 'King-Dufferin lofts'],
    landmarks: 'Queen Street West shops, Parkdale Public Library, and Sunnyside Pavilion',
    typicalHomes: 'narrow Victorian row houses with basement or rear-addition laundry rooms, plus 1960s apartment towers along Jameson and Spencer',
    rentalNote: 'Parkdale has one of the highest rental proportions in Toronto — over 70% of households rent. Landlord-supplied appliances tend to be older Whirlpool and GE units running 12-20 years.',
    uniqueFact: 'Many Parkdale Victorians have laundry hookups in the basement accessed by narrow Victorian staircases with tight 90-degree turns. Full-size washers sometimes cannot be moved through these passages without removing the basement door frame.',
  },
  {
    slug: 'the-junction',
    name: 'The Junction',
    region: 'West Toronto',
    description: 'a revitalized West Toronto neighbourhood centred on Dundas Street West near Keele',
    housing: 'renovated workers\u2019 cottages from the 1900s-1920s, post-war bungalows, and new mid-rise condos along the Dundas corridor',
    era: '1900s-1920s workers\u2019 houses renovated between 2005 and 2020, plus new construction from 2010 onward',
    brands: 'mix of older Kenmore and Maytag in unrenovated homes; Bosch, Samsung, and LG in recently renovated properties',
    waterNote: 'The Junction\u2019s water supply was originally separate from Toronto\u2019s until annexation in 1909. Some properties on side streets still have clay tile drain connections that cause slower drainage affecting washer pump cycles.',
    subAreas: ['Dundas-Keele intersection', 'Pacific Avenue', 'Annette Street', 'High Park North edge', 'Runnymede-Bloor corridor'],
    landmarks: 'Dundas West strip, Junction Triangle, and the West Toronto Railpath',
    typicalHomes: 'narrow-lot detached houses with main-floor or basement laundry, plus stacked townhouses with in-unit compact washers',
    rentalNote: 'The Junction has shifted from working-class rental to owner-occupied since gentrification accelerated around 2010. Renovated homes typically upgraded to front-loading HE machines.',
    uniqueFact: 'The Junction was a dry area (no alcohol sales) until 1998 due to a century-old temperance bylaw. The neighbourhood\u2019s workers\u2019 cottages were built on 15-to-20-foot-wide lots, meaning laundry rooms are squeezed into spaces originally designed as coal storage or summer kitchens.',
  },
  {
    slug: 'leaside',
    name: 'Leaside',
    region: 'East York',
    description: 'an affluent East York neighbourhood between Bayview Avenue and Laird Drive, north of Eglinton',
    housing: '1940s-1960s bungalows and split-levels on generous lots, with some newer custom builds replacing original homes',
    era: '1940s-1960s suburban development, largely built by builders Dickinson and Dickinson, with renovations common from 1990 onward',
    brands: 'Maytag, Whirlpool, and GE in original-era homes; newer renovations install Bosch, Miele, and LG',
    waterNote: 'Leaside\u2019s post-war plumbing uses copper supply lines that remain in good condition, but original cast-iron drain stacks in pre-renovation homes can develop internal scale buildup that restricts washer drain flow at higher pump pressures.',
    subAreas: ['Bayview-Eglinton area', 'McRae Drive', 'Millwood Road', 'Airdrie Road', 'Parkhurst Boulevard'],
    landmarks: 'Leaside Memorial Gardens, Sunnybrook Park, and Trace Manes Park',
    typicalHomes: 'brick bungalows with dedicated basement laundry rooms, often 200+ square feet with ample clearance for full-size machines',
    rentalNote: 'Leaside is predominantly owner-occupied single-family homes. Homeowners typically maintain and replace appliances on schedule rather than running them to failure.',
    uniqueFact: 'Leaside was a separate municipality until 1967. Its homes were built to a consistent mid-century plan with standardized basement layouts, making laundry room access and machine positioning more predictable than in older Toronto neighbourhoods.',
  },
  {
    slug: 'lawrence-park',
    name: 'Lawrence Park',
    region: 'North Toronto',
    description: 'one of Toronto\u2019s most affluent residential enclaves between Yonge Street and Bayview Avenue, south of Lawrence Avenue',
    housing: 'Tudor Revival, Arts and Crafts, and Georgian Revival homes on large wooded lots, many with extensive basement renovations',
    era: '1910s-1940s original construction, with significant renovations and additions from 2000 onward',
    brands: 'Miele, Sub-Zero, Wolf, Bosch, and Thermador in renovated kitchens; some original Maytag and Whirlpool units in unrenovated utility areas',
    waterNote: 'Lawrence Park homes often have water softener systems installed during basement renovations. Softened water can accelerate rubber gasket deterioration in front-loading washers, requiring more frequent door boot replacement than in unsoftened-water areas.',
    subAreas: ['Lawrence-Yonge area', 'Mount Pleasant and Lawrence', 'Blythwood Road', 'St. Edmund\u2019s Drive', 'Dawlish Avenue'],
    landmarks: 'Sherwood Park, Alexander Muir Memorial Gardens, and Lawrence Park Collegiate',
    typicalHomes: 'large detached homes with finished basements containing dedicated laundry rooms, often with separate utility sinks and custom cabinetry around machines',
    rentalNote: 'Lawrence Park is almost entirely owner-occupied. Homes in this neighbourhood have premium appliance packages that homeowners expect maintained to manufacturer specifications.',
    uniqueFact: 'Lawrence Park\u2019s winding streets and ravine-adjacent lots create delivery challenges for large appliances. Some properties require appliances to be brought in through basement walkouts or side-yard access paths rather than the front entrance.',
  },
  {
    slug: 'davisville-village',
    name: 'Davisville Village',
    region: 'Midtown Toronto',
    description: 'a midtown neighbourhood centred on Davisville Avenue between Yonge Street and Mount Pleasant Road',
    housing: '1920s-1940s semi-detached homes alongside 1960s-1970s apartment towers and new boutique condo developments',
    era: '1920s-1940s residential construction mixed with 1960s apartment buildings and 2010s infill condos',
    brands: 'Bosch, LG, and Samsung in condo units; GE, Whirlpool, and Maytag in older semi-detached homes',
    waterNote: 'Davisville\u2019s condo buildings have centralized water pressure regulation. Fluctuations in building water pressure during peak morning hours can trigger inlet valve error codes on Samsung front-loaders — a known issue in multi-unit buildings along Mount Pleasant.',
    subAreas: ['Davisville-Yonge intersection', 'Merton Street', 'Balliol Street', 'Mount Pleasant strip', 'Belsize Drive'],
    landmarks: 'June Rowlands Park, Davisville subway station, and the Mount Pleasant commercial strip',
    typicalHomes: 'semi-detached houses with basement laundry, and high-rise condo suites with stacked or side-by-side compact laundry pairs in closets',
    rentalNote: 'Davisville has a mix of young professional renters in condos and families who own semi-detached homes. Condo landlords frequently request quick turnaround on washer repairs to avoid tenant complaints.',
    uniqueFact: 'Davisville Village was the site of a major Canadian military hospital during WWII — the Davisville Military Hospital. The neighbourhood\u2019s semi-detached homes have remarkably uniform floor plans, meaning technicians who know one Davisville semi know the laundry layout of most.',
  },
  {
    slug: 'cabbagetown',
    name: 'Cabbagetown',
    region: 'Downtown East Toronto',
    description: 'a historic downtown east neighbourhood bounded by Parliament Street, Wellesley, the Don River, and Gerrard Street East',
    housing: 'restored Victorian row houses and semi-detached homes from the 1870s-1890s, with some converted to multi-unit rentals',
    era: '1870s-1890s Victorian construction, extensively restored during the gentrification wave of the 1980s-2000s',
    brands: 'mix of older GE and Frigidaire in rental units; Bosch, Miele, and Samsung in owner-restored homes',
    waterNote: 'Cabbagetown\u2019s Victorian-era homes were retrofitted with indoor plumbing long after original construction. Drain pipe routing in these homes is often indirect, following original building geometry rather than optimal drainage paths, which can cause slow-drain issues with modern high-efficiency washers.',
    subAreas: ['Parliament Street corridor', 'Winchester Street', 'Metcalfe Street', 'Wellesley Cottages', 'Riverdale Park edge'],
    landmarks: 'Riverdale Farm, Allan Gardens, and Winchester Hotel',
    typicalHomes: 'narrow Victorian row houses 14-18 feet wide, with laundry typically in tight basement spaces accessed by steep, narrow staircases',
    rentalNote: 'Cabbagetown has a significant split between fully restored owner-occupied Victorians and multi-unit rental conversions. Rental units often have stackable compact washer-dryer pairs in closet alcoves.',
    uniqueFact: 'Cabbagetown is considered the largest continuous area of preserved Victorian housing in North America. The narrow lot widths (some as small as 14 feet) mean laundry spaces are extremely tight, and technicians must often work in spaces where the washer is flush against walls on three sides.',
  },
  {
    slug: 'islington-village',
    name: 'Islington Village',
    region: 'Etobicoke',
    description: 'a suburban village centre in central Etobicoke along Dundas Street West near Islington Avenue',
    housing: '1950s-1980s detached homes and bungalows, 1970s apartment towers along Bloor, and newer condo developments near the subway',
    era: '1950s-1980s suburban development, with condo construction from 2005 onward near Islington subway station',
    brands: 'Kenmore, Whirlpool, and Samsung are dominant; newer condos have LG and Bosch compact units',
    waterNote: 'Islington Village is served by the Lake Ontario water treatment system through Etobicoke distribution mains. Water hardness is comparable to the Toronto average but the 1970s copper piping in many apartment buildings develops pinhole corrosion that introduces particulate into the water supply, clogging washer inlet screens.',
    subAreas: ['Dundas-Islington intersection', 'Burnhamthorpe Road area', 'Bloor West near Islington station', 'Kingsway South edge', 'Markland Wood border'],
    landmarks: 'Islington subway station, Montgomery\u2019s Inn, and Islington Village Park',
    typicalHomes: 'side-split and back-split homes with ground-level or basement laundry rooms, plus high-rise apartments with shared or in-suite laundry',
    rentalNote: 'Islington Village has a healthy mix of long-term homeowners maintaining 1960s-1980s properties and renters in apartment towers. Older homeowner appliances tend to be 15-25 year old Kenmore and Whirlpool units.',
    uniqueFact: 'Islington Village retains its original 1850s village character along Dundas Street despite being absorbed into Etobicoke and then Toronto. The area\u2019s side-split homes have an unusual half-level laundry configuration where the washer sits on the lower level with restricted headroom.',
  },
  {
    slug: 'humber-valley',
    name: 'Humber Valley',
    region: 'Etobicoke',
    description: 'a prestigious residential enclave in south Etobicoke along the Humber River valley, between Old Mill and Royal York Road',
    housing: 'large custom-built homes on wooded lots overlooking the Humber River ravine, many with extensive renovations and additions',
    era: '1930s-1960s original construction, with many homes substantially rebuilt or expanded from 2000 onward',
    brands: 'Miele, Bosch, Sub-Zero-Wolf ecosystem appliances, and high-end LG Signature and Samsung BESPOKE in recent renovations',
    waterNote: 'Humber Valley\u2019s proximity to the ravine means some homes experience seasonal groundwater pressure on basement walls. Basement laundry rooms in ravine-adjacent properties occasionally develop humidity issues that accelerate corrosion on washer control boards and electrical connections.',
    subAreas: ['Old Mill area', 'Riverside Drive', 'Riverwood Parkway', 'South Kingsway', 'Berry Road'],
    landmarks: 'Old Mill Inn, Humber River bridge, and James Gardens',
    typicalHomes: 'large detached homes with fully finished basements containing spacious laundry rooms, often with premium finishes and custom cabinetry matching the rest of the home',
    rentalNote: 'Humber Valley is almost exclusively owner-occupied with high property values. Homeowners invest in premium appliances and expect white-glove service with careful attention to surrounding finishes during repair work.',
    uniqueFact: 'Humber Valley homes backing onto the ravine often have walkout basements with laundry rooms at the lowest level. Spring thaw along the Humber can raise ambient humidity in these spaces to levels that cause condensation on cool washer surfaces, occasionally triggering moisture-related control board faults.',
  },
  {
    slug: 'birchcliff',
    name: 'Birchcliff',
    region: 'Scarborough',
    description: 'a gentrifying lakeside Scarborough neighbourhood along Kingston Road between Victoria Park and Birchmount',
    housing: '1940s-1950s bungalows and Cape Cods on compact lots, with growing numbers of custom rebuilds and additions',
    era: '1940s-1950s post-war bungalow construction, gentrification-driven rebuilds accelerating from 2015 onward',
    brands: 'older homes have Whirlpool, Kenmore, and GE; rebuilt and renovated homes install Samsung, LG, and Bosch',
    waterNote: 'Birchcliff\u2019s proximity to the Scarborough Bluffs means the local water table is high. Basement laundry rooms in original bungalows occasionally experience dampness during spring thaw that can affect washer motor and control board longevity.',
    subAreas: ['Kingston Road commercial strip', 'Birch Cliff Heights', 'Cliffside area', 'Fallingbrook neighbourhood', 'Birchmount-Kingston area'],
    landmarks: 'Scarborough Bluffs, Bluffers Park, and Rosetta McClain Gardens',
    typicalHomes: 'compact bungalows with basement laundry accessed through narrow interior stairs, plus a growing number of two-storey rebuilds with main-floor laundry rooms',
    rentalNote: 'Birchcliff is transitioning from long-term older residents to young families doing major renovations. Original homes still running 15-25 year old top-loaders coexist with brand-new front-loading installations.',
    uniqueFact: 'Birchcliff sits on top of the Scarborough Bluffs — some properties have lots that slope toward the bluff edge. This slope means basement floors in original bungalows are not always perfectly level, which can cause front-loading washers to vibrate excessively if not properly shimmed during installation.',
  },
  {
    slug: 'scarborough-village',
    name: 'Scarborough Village',
    region: 'Scarborough',
    description: 'a diverse Scarborough neighbourhood along Kingston Road east of Markham Road, with strong South Asian and Caribbean community presence',
    housing: '1950s-1970s detached homes and semi-detached houses, 1980s townhouse complexes, and scattered apartment buildings',
    era: '1950s-1970s suburban development, with townhouse additions in the 1980s',
    brands: 'LG, Samsung, and Whirlpool are the dominant brands; older properties still running Kenmore and GE units from the 1990s-2000s',
    waterNote: 'Scarborough Village\u2019s water distribution extends to the eastern edge of the Toronto system. Water pressure at end-of-line locations can drop during peak usage, causing intermittent fill issues on washers with pressure-sensitive inlet valves.',
    subAreas: ['Kingston Road east strip', 'Markham-Eglinton area', 'Scarborough Golf Club area', 'Meadowvale Drive', 'Scarborough Village Recreation Centre area'],
    landmarks: 'Scarborough Village Recreation Centre, Thomson Memorial Park, and Gates Gully bluffs',
    typicalHomes: 'modest detached homes and semi-detached houses with basement laundry, plus row townhouses with ground-floor laundry closets',
    rentalNote: 'Scarborough Village has a mix of long-term homeowners and renters. Many households have extended families sharing the home, putting higher demand on laundry appliances than single-family usage patterns.',
    uniqueFact: 'Scarborough Village\u2019s diverse community means our technicians encounter a wider variety of detergent and wash cycle habits than in most neighbourhoods. Heavy-use households running 8-12 loads per week wear drum bearings and pump components at roughly twice the rate of a 4-5 load per week household.',
  },
];

// ─── SERVICES ──────────────────────────────────────────────
const services = [
  {
    slug: 'fridge-repair',
    name: 'Fridge',
    fullName: 'Refrigerator',
    altName: 'Refrigerator / Fridge',
    priceRange: '$130–$400',
    servicePageSlug: 'fridge-repair-near-me',
    commonProblems: [
      { icon: '&#127777;', title: 'Not Cooling', desc: 'Compressor, condenser fan, or sealed system fault. We diagnose and repair on the first visit.' },
      { icon: '&#129482;', title: 'Frost Buildup', desc: 'Defrost heater, thermostat, or timer failure — cleared and repaired same day.' },
      { icon: '&#128166;', title: 'Leaking Water', desc: 'Drain line blockage, water inlet valve failure, or cracked drip pan — found and fixed on-site.' },
      { icon: '&#128308;', title: 'Unusual Noises', desc: 'Fan motor, compressor mount, or condenser rattle — identified and resolved quickly.' },
      { icon: '&#9889;', title: 'Error Codes', desc: 'All manufacturer fault codes decoded and root cause repaired, not just cleared.' },
      { icon: '&#128683;', title: 'Door Seal Issues', desc: 'Worn or torn gasket causing warm air infiltration — replaced with OEM-quality seal.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$130 – $200', '90 days', 'Thermostat, fan motor, door seal'],
      ['Standard Repair', '$200 – $320', '90 days', 'Defrost system, control board, ice maker'],
      ['Major Repair', '$320 – $450', '90 days', 'Compressor, sealed system, inverter board'],
    ],
    commonIssues: ['not cooling', 'frost buildup', 'leaking water', 'making loud noises', 'ice maker not working'],
  },
  {
    slug: 'washer-repair',
    name: 'Washer',
    fullName: 'Washer',
    altName: 'Washer / Washing Machine',
    priceRange: '$120–$350',
    servicePageSlug: 'washer-repair-near-me',
    commonProblems: [
      { icon: '&#128269;', title: 'Not Turning On', desc: 'Power board, thermal fuse, or control module failure. We diagnose and repair on the first visit.' },
      { icon: '&#9889;', title: 'Error Codes', desc: 'We read all manufacturer fault codes and address the root cause — not just clear the code.' },
      { icon: '&#128166;', title: 'Leaking Water', desc: 'Door seals, hose connections, pump seal failures — found and fixed same day near you.' },
      { icon: '&#128308;', title: 'Unusual Noises', desc: 'Grinding, squeaking, banging — caused by worn bearings, belts, or loose parts. We fix it right.' },
      { icon: '&#127777;', title: 'Not Spinning', desc: 'Motor coupler, lid switch, or drive belt failure — diagnosed and repaired on the same visit.' },
      { icon: '&#128683;', title: 'Door / Latch Problems', desc: 'Door won\u2019t close, latch broken, or seal worn out. Fast replacement with OEM-quality parts.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$120 – $180', '90 days', 'Switch, sensor, belt, fuse'],
      ['Standard Repair', '$180 – $280', '90 days', 'Motor, pump, door seal, board'],
      ['Major Repair', '$280 – $420', '90 days', 'Drum bearing, transmission, control board'],
    ],
    commonIssues: ['not spinning', 'not draining', 'leaking water', 'making loud noises', 'won\u2019t start'],
  },
  {
    slug: 'dryer-repair',
    name: 'Dryer',
    fullName: 'Dryer',
    altName: 'Dryer / Clothes Dryer',
    priceRange: '$120–$350',
    servicePageSlug: 'dryer-repair-near-me',
    commonProblems: [
      { icon: '&#127777;', title: 'Not Heating', desc: 'Heating element, thermal fuse, or gas igniter failure. Diagnosed and repaired same day.' },
      { icon: '&#128269;', title: 'Not Turning On', desc: 'Door switch, thermal fuse, or start switch failure — tested and replaced on the first visit.' },
      { icon: '&#128308;', title: 'Unusual Noises', desc: 'Drum rollers, idler pulley, or bearing wear — identified and resolved quickly.' },
      { icon: '&#9889;', title: 'Takes Too Long', desc: 'Restricted vent, failed heating element, or moisture sensor fault — root cause repaired.' },
      { icon: '&#128683;', title: 'Drum Not Turning', desc: 'Broken belt, worn drum rollers, or motor failure. Replaced with OEM-quality parts.' },
      { icon: '&#128166;', title: 'Overheating', desc: 'Blocked vent, failed thermostat, or cycling thermostat issue — critical safety repair done on-site.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$120 – $180', '90 days', 'Belt, fuse, sensor, switch'],
      ['Standard Repair', '$180 – $280', '90 days', 'Heating element, drum rollers, motor'],
      ['Major Repair', '$280 – $400', '90 days', 'Control board, gas valve, drum bearing'],
    ],
    commonIssues: ['not heating', 'not turning on', 'making loud noises', 'takes too long to dry', 'drum not spinning'],
  },
  {
    slug: 'dishwasher-repair',
    name: 'Dishwasher',
    fullName: 'Dishwasher',
    altName: 'Dishwasher',
    priceRange: '$120–$350',
    servicePageSlug: 'dishwasher-repair-near-me',
    commonProblems: [
      { icon: '&#128166;', title: 'Not Draining', desc: 'Drain pump, check valve, or drain hose blockage. Cleared and repaired on the first visit.' },
      { icon: '&#128269;', title: 'Not Cleaning', desc: 'Spray arm blockage, wash motor failure, or detergent dispenser fault — diagnosed and fixed same day.' },
      { icon: '&#127777;', title: 'Not Drying', desc: 'Heating element, vent fan, or rinse aid dispenser issue. Repaired to restore full dry performance.' },
      { icon: '&#9889;', title: 'Error Codes', desc: 'All manufacturer fault codes decoded. We fix the root cause, not just reset the code.' },
      { icon: '&#128308;', title: 'Leaking Water', desc: 'Door gasket, pump seal, or supply line failure — found and fixed to prevent water damage.' },
      { icon: '&#128683;', title: 'Door Latch Broken', desc: 'Latch mechanism, strike plate, or hinge failure. Quick replacement with quality parts.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$120 – $180', '90 days', 'Latch, sensor, spray arm, gasket'],
      ['Standard Repair', '$180 – $280', '90 days', 'Pump, motor, heating element, board'],
      ['Major Repair', '$280 – $400', '90 days', 'Control module, wash motor assembly'],
    ],
    commonIssues: ['not draining', 'not cleaning properly', 'leaking', 'not starting', 'leaving dishes wet'],
  },
  {
    slug: 'oven-repair',
    name: 'Oven',
    fullName: 'Oven',
    altName: 'Oven / Stove / Range',
    priceRange: '$130–$400',
    servicePageSlug: 'oven-repair-near-me',
    commonProblems: [
      { icon: '&#127777;', title: 'Not Heating', desc: 'Bake or broil element, igniter, or gas valve failure. Diagnosed and repaired on the first visit.' },
      { icon: '&#9889;', title: 'Temperature Wrong', desc: 'Thermostat calibration, sensor failure, or control board issue. Corrected to restore accurate cooking.' },
      { icon: '&#128269;', title: 'Not Turning On', desc: 'Igniter, fuse, control board, or wiring fault. Tested and repaired same day.' },
      { icon: '&#128308;', title: 'Self-Clean Failure', desc: 'Door lock mechanism, thermal fuse, or control board fault — repaired safely.' },
      { icon: '&#128683;', title: 'Door Won\u2019t Close', desc: 'Hinge, spring, or door gasket failure. Replaced for proper seal and safe operation.' },
      { icon: '&#128166;', title: 'Gas Smell', desc: 'Gas valve, igniter, or supply line issue — safety-critical repair performed immediately.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$130 – $200', '90 days', 'Igniter, sensor, switch, gasket'],
      ['Standard Repair', '$200 – $320', '90 days', 'Element, thermostat, gas valve, board'],
      ['Major Repair', '$320 – $450', '90 days', 'Control board, convection motor, sealed burner'],
    ],
    commonIssues: ['not heating', 'uneven cooking', 'gas smell', 'won\u2019t turn on', 'self-clean not working'],
  },
];

// Cross-reference services for related links
const allNeighbourhoods = neighbourhoods.map(n => n.slug);

// ─── CONTENT GENERATORS ──────────────────────────────────
// Each generates unique body content per neighbourhood+service combo

function generateFridgeContent(n) {
  return `
<h2>Refrigerator Repair Near You in ${n.name} — Local Technicians Who Know Your Neighbourhood</h2>
<p>${n.name} is ${n.description}. The housing stock consists primarily of ${n.housing}, built during the ${n.era}. Appliance Repair Neary provides same-day refrigerator repair across ${n.name}, with technicians dispatched from our coverage zone who are already familiar with the typical building layouts and appliance configurations found in ${n.region} properties. We keep refrigerator repair availability for ${n.name} calls placed before 2 PM, with arrival typically within two to four hours.</p>

<p>The typical ${n.name} home features ${n.typicalHomes}. The dominant refrigerator brands in this neighbourhood are ${n.brands}. Our technicians carry replacement parts for all of these brands on every ${n.name} dispatch, including compressor start relays, defrost heaters, evaporator fan motors, water inlet valves, and main control boards. This parts-on-truck approach allows first-visit completion for the majority of refrigerator repairs in ${n.name} without requiring a return trip for parts ordering.</p>

<h2>Common Refrigerator Problems in ${n.name} Homes</h2>
<p>The most common refrigerator service calls from ${n.name} involve not cooling, frost buildup in the freezer section, water leaking onto the kitchen floor, and ice maker failures. The ${n.era} construction typical of ${n.name} homes creates specific conditions that affect refrigerator operation. ${n.waterNote}</p>

<p>Compressor failure accounts for approximately 20% of refrigerator service calls from ${n.name}. In homes with ${n.typicalHomes}, the refrigerator is often positioned in a kitchen alcove or against a wall with limited ventilation clearance behind the unit. When condenser coils cannot dissipate heat efficiently due to restricted airflow, the compressor works harder and wears faster. We check condenser coil condition and surrounding clearance on every ${n.name} refrigerator call and advise homeowners on optimal positioning where the kitchen layout permits adjustment.</p>

<p>Defrost system failure is the second most common refrigerator repair across ${n.name}. The defrost heater, thermostat, and timer work together to prevent frost accumulation on the evaporator coils. When any component in this circuit fails, frost builds on the evaporator until airflow to the fresh food compartment is blocked, causing temperatures to rise. In ${n.name} homes where the refrigerator runs in a warm kitchen environment — particularly during summer when ${n.region} temperatures push indoor ambient temperatures higher — the defrost cycle runs more frequently and components wear accordingly. We test all three defrost circuit components on every frost-related call to ensure the complete circuit is restored.</p>

<h2>Refrigerator Brands Common in ${n.name}</h2>
<p>Our service data for ${n.name} shows the following brand distribution: ${n.brands}. ${n.rentalNote}</p>

<p>For Samsung refrigerators common in ${n.name}, the most frequent repairs involve the ice maker assembly, twin cooling evaporator fan motor, and main PCB control board. Samsung RF and RT series models manufactured between 2014 and 2020 have a known ice buildup issue behind the rear panel of the freezer section caused by a drain channel design that allows condensation to freeze. We carry the updated drain channel kit and apply the manufacturer-recommended thermal paste treatment that resolves this recurring issue permanently.</p>

<p>For LG refrigerators in ${n.name}, the linear compressor is the most significant repair item. LG\u2019s linear compressor technology, used across the LT and LF series from 2010 onward, provides efficient operation but has a higher failure rate between years 7 and 12 than conventional reciprocating compressors. Symptoms include a clicking sound from the rear lower panel followed by the refrigerator warming. We carry replacement linear compressors and can complete the swap in a single visit for ${n.name} customers.</p>

<h2>${n.name} Neighbourhood Access and Service Notes</h2>
<p>${n.uniqueFact}</p>

<p>Our technicians covering ${n.name} are familiar with the ${n.subAreas.join(', ')} areas. Whether the call comes from a ${n.typicalHomes.split(',')[0]} or a newly built unit, we arrive with the tools and parts appropriate for the building type. All refrigerator repairs in ${n.name} include a 90-day parts and labour warranty. If the same fault recurs within the warranty period, we return at no charge.</p>

<ul>
  <li>Same-day refrigerator repair across ${n.name} — ${n.subAreas.slice(0,3).join(', ')}</li>
  <li>Compressor, defrost system, and ice maker repair for all major brands</li>
  <li>Samsung ice buildup fix with updated drain channel kit</li>
  <li>LG linear compressor replacement completed in a single visit</li>
  <li>Parts carried on truck for ${n.brands.split(',')[0].trim()} and other common ${n.name} brands</li>
  <li>90-day warranty on all parts and labour, upfront pricing before work begins</li>
</ul>

<p><strong>Technician Tip — ${n.name}:</strong> If your refrigerator is running constantly but the freezer temperature is normal while the fresh food compartment is warm, the evaporator fan motor behind the rear freezer panel is the most likely cause. This motor circulates cold air from the freezer into the fridge section through a damper duct. A failed fan motor means cold air stays in the freezer and never reaches the refrigerator side. This is a common repair in ${n.name} homes and typically costs $160–$240 including parts and labour.</p>`;
}

function generateWasherContent(n) {
  return `
<h2>Washer Repair Near You in ${n.name} — Serving ${n.region} Homes and Apartments</h2>
<p>${n.name} is ${n.description}. The neighbourhood features ${n.housing}, dating from the ${n.era}. Appliance Repair Neary maintains same-day washer repair coverage across ${n.name}, dispatching technicians who know the building types and appliance configurations typical of ${n.region}. Calls placed before 2 PM receive same-day service with arrival typically within two to four hours.</p>

<p>The typical laundry setup in ${n.name} involves ${n.typicalHomes}. The most common washer brands in ${n.name} are ${n.brands}. Our service trucks carry drum bearing kits, door boot gaskets, water inlet valves, drain pump assemblies, lid switches, and control boards for all of these brands, enabling first-visit completion for the majority of washer repairs in ${n.name} without waiting for parts to be ordered.</p>

<h2>Washer Problems Specific to ${n.name} Homes</h2>
<p>The housing stock and water conditions in ${n.name} create a distinct pattern of washer failures. ${n.waterNote} Understanding these local conditions allows our technicians to diagnose issues faster and recommend preventive measures that extend machine life for ${n.name} residents.</p>

<p>Drum bearing failure is the leading washer repair call from ${n.name}. Front-loading washers in the 7-to-15-year age range develop bearing wear that presents as a grinding or rumbling noise during the spin cycle. The sound typically starts faint and grows louder over weeks. In ${n.name} homes with ${n.typicalHomes}, the noise often resonates through the floor structure, making it seem louder than it would in a detached setting. We carry bearing and seal kits for Samsung WF, LG WM, Whirlpool WFW, and Bosch WAT series machines — the most common platforms across ${n.name}.</p>

<p>Drain pump failure is the second most common washer call from ${n.name}. The drain pump removes water from the tub at the end of wash and rinse cycles. Small items — coins, hair pins, fabric fragments — can lodge in the pump impeller and cause it to seize or run noisily. In ${n.name} households, ${n.rentalNote} Heavy-use households accelerate pump wear, and we see pump failures at 5-7 years rather than the typical 8-10 year lifespan in moderate-use homes.</p>

<h2>Washer Brands and Models in ${n.name}</h2>
<p>The brand mix in ${n.name} reflects the neighbourhood\u2019s character: ${n.brands}. ${n.uniqueFact}</p>

<p>For Samsung front-loading washers common in ${n.name}, the primary service calls involve the door boot gasket, drain pump, and spider arm assembly. Samsung WF42 and WF45 series machines in the 8-12 year range develop door boot tears in the lower fold where water pools between uses. We carry replacement boot gaskets and apply a preventive treatment to the drain channel during installation. The spider arm — a three-armed bracket that supports the drum — can corrode and crack in hard-water environments, causing the drum to wobble and producing metallic scraping sounds during rotation.</p>

<p>For top-loading washers — primarily Whirlpool, Maytag, and Kenmore — that remain common in ${n.name}\u2019s older housing stock, the primary repairs are lid switch replacement, motor coupling failure, and transmission plate wear. These machines were built for durability but many in ${n.name} are now 15-25 years old, well past their design lifespan. Our technicians assess whether repair or replacement offers better value and provide honest guidance based on the specific machine\u2019s condition.</p>

<h2>Laundry Room Access in ${n.name} Properties</h2>
<p>The ${n.era} construction typical of ${n.name} creates specific access conditions for washer repair. ${n.typicalHomes.charAt(0).toUpperCase() + n.typicalHomes.slice(1)} present varying levels of workspace around the machine. Our technicians arrive with compact tool sets and work-surface protection appropriate for the building types common in ${n.subAreas.slice(0,3).join(', ')} and surrounding ${n.name} streets.</p>

<ul>
  <li>Same-day washer repair across ${n.name} — ${n.subAreas.slice(0,3).join(', ')}</li>
  <li>Drum bearing kits for Samsung, LG, Whirlpool, and Bosch front-loaders</li>
  <li>Door boot gasket replacement with preventive drain treatment</li>
  <li>Top-loader lid switch, motor coupling, and transmission service</li>
  <li>Parts on truck for ${n.brands.split(',')[0].trim()} and all common ${n.name} brands</li>
  <li>90-day warranty on all parts and labour, upfront pricing confirmed before work begins</li>
</ul>

<p><strong>Technician Tip — ${n.name}:</strong> If your front-loading washer has a musty odour, the door boot gasket\u2019s lower fold is almost certainly the source. This fold traps water after every cycle, and in ${n.name}\u2019s water conditions, mineral residue bonds to the rubber surface and creates a biofilm. Wiping the fold dry after each load and running a monthly hot-water cleaning cycle with a washer cleaner tablet prevents the buildup. If the odour persists after cleaning, the gasket has absorbed the contamination and needs replacement — a common repair we complete in about one hour.</p>`;
}

function generateDryerContent(n) {
  return `
<h2>Dryer Repair Near You in ${n.name} — Fast Service Across ${n.region}</h2>
<p>${n.name} is ${n.description}. The area\u2019s housing consists of ${n.housing}, built during the ${n.era}. Appliance Repair Neary provides same-day dryer repair across ${n.name}, with technicians familiar with the building styles, venting configurations, and appliance brands typical of ${n.region} properties. Calls placed before 2 PM are eligible for same-day arrival, typically within two to four hours.</p>

<p>Dryer repair in ${n.name} presents specific considerations related to the neighbourhood\u2019s housing stock. ${n.typicalHomes.charAt(0).toUpperCase() + n.typicalHomes.slice(1)} create varying venting configurations — some straightforward, others requiring longer vent runs or multiple elbows that restrict airflow and increase dryer operating temperatures. The common dryer brands in ${n.name} — ${n.brands} — each have model-specific components that our technicians carry on every dispatch.</p>

<h2>Common Dryer Problems in ${n.name}</h2>
<p>The most frequent dryer service calls from ${n.name} involve not heating, excessive drying time, unusual noises, and drum not turning. Each of these symptoms has multiple potential root causes that our technicians systematically diagnose on-site.</p>

<p>Heating failure is the leading dryer complaint from ${n.name}. In electric dryers, the heating element, high-limit thermostat, cycling thermostat, and thermal fuse form a circuit that must be intact for heat production. A single failed component breaks the circuit. In gas dryers common in older ${n.name} homes with gas lines, the igniter, gas valve coils, and flame sensor are the equivalent components. Our technicians test all components in the heating circuit rather than replacing only the obviously failed part, ensuring the repair addresses the root cause and preventing repeat failures.</p>

<p>Excessive drying time is the second most common dryer call from ${n.name}. The primary cause is restricted exhaust venting. ${n.uniqueFact} In ${n.name} homes where the dryer vent runs through the building interior before exiting — common in ${n.housing.split(',')[0]} — lint accumulation in long vent runs gradually restricts airflow until the dryer cannot exhaust moisture efficiently. We inspect the full vent path on every dryer call and recommend professional vent cleaning when restriction is detected. This is both a performance issue and a fire safety concern.</p>

<h2>Dryer Brands and Venting in ${n.name} Homes</h2>
<p>The dryer brand distribution in ${n.name} mirrors the washer brands: ${n.brands}. ${n.rentalNote} Matched washer-dryer pairs are common in ${n.name}, and when one machine fails, homeowners often ask whether the companion machine needs attention. We inspect both machines when requested.</p>

<p>Venting configuration is a critical factor in dryer performance and safety in ${n.name}. The ${n.era} homes in this neighbourhood were designed with varying approaches to dryer exhaust routing. Basement installations in ${n.name} homes typically vent through the basement wall to the exterior — a short, straight run that provides optimal airflow. Second-floor or main-floor installations vent through the wall or up through the roof, requiring longer runs with elbows that accumulate lint faster. Our technicians note the vent configuration on every ${n.name} call and advise on appropriate cleaning intervals.</p>

<p>For Samsung dryers in ${n.name}, the primary repairs involve the heating element (DV series), the drum roller assembly, and the moisture sensor bar. Samsung dryers use a dual-paddle moisture sensor in the drum that detects wetness and controls the auto-dry cycle length. When this sensor develops a film of fabric softener residue, the dryer misreads the moisture level and shuts off prematurely, leaving clothes damp. Cleaning the sensor bar is a simple maintenance step, but if the sensor\u2019s wiring or control board connection has degraded, replacement is required.</p>

<h2>${n.name} Dryer Safety and Maintenance</h2>
<p>Dryer fires are a significant home safety concern. Lint accumulation in the exhaust vent system is the leading cause. In ${n.name}\u2019s ${n.housing.split(',')[0]}, vent runs can be 15-25 feet long with two to four elbows, creating multiple points where lint collects. We recommend annual professional vent cleaning for standard installations and semi-annual cleaning for long or complex vent runs common in certain ${n.name} building types.</p>

<p>${n.waterNote.replace(/washer|washing/gi, 'dryer').replace(/inlet valve|solenoid|pump/gi, 'heating element')} Regular maintenance including lint screen cleaning after every load, annual vent inspection, and periodic drum roller lubrication extends dryer life significantly in ${n.name} conditions.</p>

<ul>
  <li>Same-day dryer repair across ${n.name} — ${n.subAreas.slice(0,3).join(', ')}</li>
  <li>Heating element, thermostat, and thermal fuse replacement for electric and gas dryers</li>
  <li>Drum roller, idler pulley, and belt replacement for all major brands</li>
  <li>Exhaust vent inspection included with every dryer service call</li>
  <li>Parts on truck for ${n.brands.split(',')[0].trim()} and other brands common in ${n.name}</li>
  <li>90-day warranty on all parts and labour, upfront pricing before work begins</li>
</ul>

<p><strong>Technician Tip — ${n.name}:</strong> If your dryer runs but clothes come out still damp after a normal cycle, check the exhaust vent flap outside your home first. In ${n.name}, birds and debris frequently block exterior vent hoods, especially on homes backing onto mature trees near ${n.landmarks}. A blocked exterior vent forces the dryer to recirculate moist air, dramatically extending drying time. Clear the vent flap and run a test load — if drying time improves, the vent was the issue. If it doesn\u2019t improve, call us for a full diagnosis.</p>`;
}

function generateDishwasherContent(n) {
  return `
<h2>Dishwasher Repair Near You in ${n.name} — Serving ${n.region} Kitchens</h2>
<p>${n.name} is ${n.description}. The neighbourhood\u2019s housing stock includes ${n.housing}, built during the ${n.era}. Appliance Repair Neary provides same-day dishwasher repair throughout ${n.name}, with technicians who understand the plumbing configurations and appliance brands typical of ${n.region} kitchens. Calls before 2 PM are eligible for same-day service with arrival in two to four hours.</p>

<p>Dishwasher repair in ${n.name} involves both built-in and portable configurations depending on the property type. ${n.typicalHomes.charAt(0).toUpperCase() + n.typicalHomes.slice(1)} have varying kitchen layouts that determine dishwasher installation type, access for service, and plumbing connection methods. The common dishwasher brands in ${n.name} are ${n.brands}. We carry drain pumps, wash motors, control boards, door latches, and water inlet valves for all of these brands on every ${n.name} service call.</p>

<h2>Common Dishwasher Problems in ${n.name} Homes</h2>
<p>The most frequent dishwasher service calls from ${n.name} involve not draining, poor cleaning performance, leaking, and not starting. The local water conditions and housing characteristics in ${n.name} contribute to specific failure patterns.</p>

<p>${n.waterNote} Hard water deposits accumulate on spray arm nozzles, reducing water pressure and creating dead zones in the wash pattern where dishes are not properly cleaned. In ${n.name} homes, we routinely clean and descale spray arms during any dishwasher service call to restore full wash coverage. For homes with persistent hard water issues, we recommend a rinse aid adjustment and periodic citric acid wash cycles.</p>

<p>Drain pump failure is the leading dishwasher repair in ${n.name}. The drain pump removes dirty water at the end of each wash and rinse cycle. Food particles, glass fragments, and mineral deposits from ${n.name}\u2019s water supply accumulate in the pump impeller housing over time. A failing drain pump either stops draining entirely — leaving standing water in the tub — or drains slowly, causing the next cycle to start with residual dirty water. We carry drain pump assemblies for Bosch, Samsung, LG, Whirlpool, and GE dishwashers, the brands most common in ${n.name} kitchens.</p>

<h2>Dishwasher Brands in ${n.name} Kitchens</h2>
<p>Kitchen renovations in ${n.name} have shifted the brand landscape over the past decade. ${n.rentalNote} The brand distribution reflects the ${n.era} housing stock: ${n.brands}.</p>

<p>For Bosch dishwashers — increasingly common in ${n.name} renovated kitchens — the primary repairs involve the drain pump, circulation pump, and door latch mechanism. Bosch 300, 500, and 800 series models use a different drain system than most competitors, with a self-cleaning filter that still requires periodic manual cleaning to prevent performance degradation. When ${n.name} homeowners report that their Bosch dishwasher is leaving food residue on dishes, the filter assembly is the first component we inspect.</p>

<p>For Samsung and LG dishwashers in ${n.name}, control board failures are more common than in European brands. The control board manages all cycle timing, water temperature, and error detection. Power fluctuations during ${n.region} weather events can stress control board components. We carry replacement control boards for Samsung DW and LG LD series models and can complete the swap during a single visit.</p>

<h2>${n.name} Plumbing and Dishwasher Installation Notes</h2>
<p>${n.uniqueFact} These building characteristics affect dishwasher installation and service access in ${n.name}. Our technicians know to bring appropriate tools for the building types in ${n.subAreas.slice(0,3).join(', ')} and surrounding ${n.name} streets.</p>

<p>Dishwasher leaks in ${n.name} homes often originate from the door gasket, the supply line connection under the sink, or the drain hose where it connects to the garbage disposal or sink drain. In ${n.era} kitchens, the under-sink area may have been modified multiple times over the decades, creating non-standard plumbing configurations that require careful inspection. Our technicians trace the entire water path — from supply valve through the machine to the drain connection — on every leak call to identify the actual source rather than assuming the most obvious point.</p>

<ul>
  <li>Same-day dishwasher repair across ${n.name} — ${n.subAreas.slice(0,3).join(', ')}</li>
  <li>Drain pump, wash motor, and circulation pump service for all major brands</li>
  <li>Bosch filter and drain system service for 300, 500, and 800 series models</li>
  <li>Control board replacement for Samsung and LG dishwashers</li>
  <li>Parts on truck for ${n.brands.split(',')[0].trim()} and other brands common in ${n.name}</li>
  <li>90-day warranty on all parts and labour, upfront pricing before work begins</li>
</ul>

<p><strong>Technician Tip — ${n.name}:</strong> If your dishwasher leaves a white film on glasses and dishes, hard water mineral deposits are the most likely cause. Before calling for service, try running an empty cycle with a dishwasher cleaner or two cups of white vinegar in a bowl on the top rack. If the film returns after one or two loads, the issue is ongoing water hardness rather than a machine fault. In ${n.name}, where water hardness varies by building and supply line age, adjusting the rinse aid dispenser to a higher setting often resolves the issue without any mechanical repair needed.</p>`;
}

function generateOvenContent(n) {
  return `
<h2>Oven Repair Near You in ${n.name} — Expert Service Across ${n.region}</h2>
<p>${n.name} is ${n.description}. The neighbourhood features ${n.housing}, from the ${n.era}. Appliance Repair Neary provides same-day oven, stove, and range repair throughout ${n.name}. Our technicians service both gas and electric models and understand the specific configurations found in ${n.region} kitchens. Calls placed before 2 PM qualify for same-day service with arrival typically within two to four hours.</p>

<p>Oven repair in ${n.name} involves freestanding ranges, wall ovens, slide-in models, and cooktop-plus-wall-oven configurations depending on the kitchen layout. ${n.typicalHomes.charAt(0).toUpperCase() + n.typicalHomes.slice(1)} have different kitchen sizes and configurations that determine which oven format is installed. The dominant oven brands in ${n.name} are ${n.brands}. We carry heating elements, igniters, thermostats, control boards, and safety components for all of these brands on every service dispatch.</p>

<h2>Common Oven Problems in ${n.name}</h2>
<p>The most frequent oven service calls from ${n.name} involve not heating, uneven cooking temperatures, the oven not turning on, and self-clean cycle failures. Gas oven calls also include igniter failure and gas smell concerns. Safety is our first priority on every oven call — gas-related issues are treated as urgent.</p>

<p>Oven not heating is the leading service call from ${n.name}. In electric ovens, the bake element at the bottom of the oven cavity is the most common failure point. The element develops hot spots over years of thermal cycling, eventually breaking the internal wire and creating an open circuit. In gas ovens common in older ${n.name} homes with gas service, the igniter weakens over time until it cannot draw enough current to open the gas safety valve. A weak igniter glows visibly but the oven does not light — this is the classic symptom. We carry bake elements for all major electric oven brands and igniters for the most common gas models found in ${n.name} kitchens.</p>

<p>Uneven cooking temperatures are the second most common oven complaint from ${n.name}. The oven thermostat or temperature sensor reads the oven cavity temperature and signals the control board to cycle the heating element or gas burner on and off to maintain the set temperature. When the sensor drifts out of calibration, the oven overshoots or undershoots the target temperature. ${n.name} homeowners who bake frequently notice this drift first, as baking is more temperature-sensitive than roasting. We calibrate the sensor and test oven temperature with an independent thermometer on every temperature-related call.</p>

<h2>Gas vs. Electric Ovens in ${n.name}</h2>
<p>The mix of gas and electric ovens in ${n.name} reflects the neighbourhood\u2019s building history. ${n.era.charAt(0).toUpperCase() + n.era.slice(1)} homes in ${n.name} were originally built with gas service where available and electric where gas lines were not run. ${n.rentalNote}</p>

<p>${n.uniqueFact} This housing context affects oven service in ${n.name} because kitchen size, counter depth, and gas line routing vary significantly across the neighbourhood\u2019s different building eras and types. Our technicians are familiar with the typical configurations found in ${n.subAreas.slice(0,3).join(', ')} and adjust their approach based on the specific property.</p>

<p>For Samsung and LG ranges increasingly common in ${n.name}, the primary repairs involve the bake element, convection fan motor, and touch-panel control board. Samsung NE and NX series ranges use a glass touch control panel that can develop dead spots or phantom touches after exposure to heat and steam over 5-8 years. We carry replacement control panels for the most common Samsung range models in ${n.name} and complete the installation in a single visit.</p>

<h2>Oven Safety in ${n.name} Homes</h2>
<p>Oven repair involves both electrical and gas safety considerations. All of our ${n.name} technicians are trained in gas safety protocols and carry combustible gas detectors. If a gas oven repair reveals any gas line issue beyond the appliance itself, we advise the homeowner to contact a licensed gas fitter and do not attempt repairs to the gas supply infrastructure.</p>

<p>${n.waterNote.replace(/washer|washing machine/gi, 'oven').replace(/inlet valve|solenoid|pump|drain/gi, 'heating element')} Regular maintenance including keeping the oven interior clean, testing the door seal for air leaks, and running the self-clean cycle no more than twice per year (to reduce thermal stress on door lock and gasket components) extends oven life in ${n.name} conditions.</p>

<ul>
  <li>Same-day oven and range repair across ${n.name} — ${n.subAreas.slice(0,3).join(', ')}</li>
  <li>Gas igniter, gas valve, and safety system repair for gas ovens and ranges</li>
  <li>Bake element, broil element, and convection fan motor for electric ovens</li>
  <li>Temperature sensor calibration and control board replacement</li>
  <li>Parts on truck for ${n.brands.split(',')[0].trim()} and other brands common in ${n.name}</li>
  <li>90-day warranty on all parts and labour, upfront pricing before work begins</li>
</ul>

<p><strong>Technician Tip — ${n.name}:</strong> If your oven takes longer than usual to preheat, check the door gasket first. Close the oven door and run your hand along the door perimeter — if you feel warm air escaping, the gasket has lost its seal. A compromised door gasket allows heat to escape continuously, forcing the oven to work harder to maintain temperature. Gasket replacement is a straightforward repair that restores heating efficiency and is typically one of the more affordable oven repairs we perform in ${n.name} homes.</p>`;
}

// ─── FAQ GENERATORS ──────────────────────────────────────
function generateFAQs(service, n) {
  const s = service;
  const faqs = [];

  // Q1: Is there service near me?
  faqs.push({
    q: `Is there ${s.altName.toLowerCase()} repair near me in ${n.name}?`,
    a: `Yes. Appliance Repair Neary provides ${s.altName.toLowerCase()} repair throughout ${n.name}, covering ${n.subAreas.slice(0,3).join(', ')}, and surrounding ${n.region} streets. We offer same-day service when you call before 2 PM, with arrival typically within 2\u20134 hours. Call ${PHONE} to book.`
  });

  // Q2: Cost
  faqs.push({
    q: `How much does ${s.altName.toLowerCase()} repair cost in ${n.name}?`,
    a: `${s.fullName} repair in ${n.name} typically costs ${s.priceRange} depending on the brand and specific issue. We provide upfront pricing before any work begins \u2014 no hidden fees. Diagnostic is waived when you proceed with the repair. Call ${PHONE} for a same-day estimate.`
  });

  // Q3: How quickly
  faqs.push({
    q: `How quickly can you come to ${n.name} for ${s.altName.toLowerCase()} repair?`,
    a: `We offer same-day ${s.altName.toLowerCase()} repair in ${n.name}. Call before 2 PM for same-day appointments \u2014 our technicians typically arrive within 2\u20134 hours. Evening appointments are also available Monday through Saturday.`
  });

  // Q4: Brands
  faqs.push({
    q: `What ${s.altName.toLowerCase()} brands do you repair in ${n.name}?`,
    a: `We repair all major brands in ${n.name} including Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, Miele, and KitchenAid. The most common brands we service in ${n.name} are ${n.brands.split(',').slice(0,3).map(b => b.trim()).join(', ')}.`
  });

  // Q5: Neighbourhood-specific
  const specificQAs = {
    'fridge-repair': {
      q: `Why is my ${s.altName.toLowerCase()} not cooling in my ${n.name} home?`,
      a: `Common causes of a ${s.altName.toLowerCase()} not cooling in ${n.name} homes include compressor failure, condenser coil dust buildup, evaporator fan motor failure, and sealed system leaks. In ${n.name}\u2019s ${n.housing.split(',')[0]}, restricted airflow around the refrigerator is a frequent contributing factor. Our technicians diagnose the exact cause on-site and repair it the same day in most cases.`
    },
    'washer-repair': {
      q: `Can you fix a noisy washer in a ${n.name} apartment or condo?`,
      a: `Yes. Noisy washers in ${n.name} apartments and condos are typically caused by worn drum bearings, a loose counterweight, or foreign objects in the pump. Our technicians are experienced with in-suite compact washer repair in ${n.region} buildings and carry parts for Samsung, LG, and Bosch compact models common in ${n.name} units.`
    },
    'dryer-repair': {
      q: `Is dryer vent cleaning included with dryer repair in ${n.name}?`,
      a: `We inspect the dryer exhaust vent on every service call in ${n.name} and will clear minor obstructions. For full professional vent cleaning of long runs common in ${n.name}\u2019s ${n.housing.split(',')[0]}, we recommend a dedicated vent cleaning service. We can advise on appropriate cleaning frequency based on your ${n.name} home\u2019s specific vent configuration.`
    },
    'dishwasher-repair': {
      q: `Why does my dishwasher leave spots on glasses in ${n.name}?`,
      a: `White spots or film on glassware after dishwashing in ${n.name} is typically caused by hard water mineral deposits. Toronto\u2019s water hardness can leave calcium and magnesium residue on dishes. Try increasing your rinse aid setting first. If spots persist, the water inlet valve or spray arm may need service. Our ${n.name} technicians can diagnose the issue on-site.`
    },
    'oven-repair': {
      q: `Do you repair gas ovens in ${n.name}?`,
      a: `Yes, we repair both gas and electric ovens throughout ${n.name}. Gas oven repairs include igniter replacement, gas valve service, and safety system diagnostics. Our technicians carry combustible gas detectors and follow strict gas safety protocols on every ${n.name} gas oven service call.`
    },
  };

  faqs.push(specificQAs[service.slug]);

  // Q6: Warranty
  faqs.push({
    q: `Is there a warranty on ${s.altName.toLowerCase()} repairs in ${n.name}?`,
    a: `All ${s.altName.toLowerCase()} repairs in ${n.name} include a 90-day parts and labour warranty. If the same fault recurs within 90 days, we return at no charge. This warranty covers all parts installed and the labour to install them.`
  });

  return faqs;
}

// ─── RELATED LINKS ──────────────────────────────────────
function getOtherServicesInNeighbourhood(currentSlug, nSlug) {
  return services
    .filter(s => s.slug !== currentSlug)
    .map(s => `<li><a href="/${s.slug}-${nSlug}">${s.fullName} Repair in ${neighbourhoods.find(n=>n.slug===nSlug).name}</a></li>`)
    .join('\n');
}

function getSameServiceNearby(sSlug) {
  const nearby = ['toronto','scarborough','etobicoke','mississauga','brampton','north-york','vaughan','richmond-hill','markham'];
  const names = ['Toronto','Scarborough','Etobicoke','Mississauga','Brampton','North York','Vaughan','Richmond Hill','Markham'];
  return nearby.map((c,i) => `<li><a href="/${sSlug}-${c}">${services.find(s=>s.slug===sSlug).fullName} Repair in ${names[i]}</a></li>`).join('\n');
}

// ─── PAGE BUILDER ──────────────────────────────────────────
function buildPage(service, neighbourhood) {
  const s = service;
  const n = neighbourhood;
  const fileName = `${s.slug}-${n.slug}.html`;
  const canonical = `${DOMAIN}/${s.slug}-${n.slug}`;
  const title = `${s.fullName} Repair Near Me in ${n.name} | Same-Day | ${PHONE}`;
  const metaDesc = `Need ${s.altName.toLowerCase()} repair near you in ${n.name}? Same-day service available. ${s.priceRange} typical cost. 4.9\u2605 rated, 90-day warranty. Call ${PHONE}.`;
  const h1 = `${s.fullName} Repair Near You in ${n.name}`;
  const answerBoxText = `${s.fullName} repair in ${n.name} \u2014 Appliance Repair Neary serves ${n.name} with certified technicians who know ${n.era.split(',')[0]} homes. Common repairs: ${s.commonIssues.slice(0,2).join(' and ')}. Call ${PHONE}.`;
  const quickAnswer = `Appliance Repair Neary provides same-day ${s.altName.toLowerCase()} repair in ${n.name}. Call ${PHONE} \u2014 available 7 days a week, including evenings. Typical cost ${s.priceRange}. All major brands: Samsung, LG, Whirlpool, Bosch, GE, Maytag. Most repairs completed in 1\u20132 hours on the first visit. 90-day parts & labour warranty.`;

  // Generate body content
  let bodyContent;
  switch(s.slug) {
    case 'fridge-repair': bodyContent = generateFridgeContent(n); break;
    case 'washer-repair': bodyContent = generateWasherContent(n); break;
    case 'dryer-repair': bodyContent = generateDryerContent(n); break;
    case 'dishwasher-repair': bodyContent = generateDishwasherContent(n); break;
    case 'oven-repair': bodyContent = generateOvenContent(n); break;
  }

  const faqs = generateFAQs(s, n);

  // Schema
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Appliance Repair Near Me \u2014 Toronto & GTA",
        "telephone": "+14375241053",
        "url": "https://appliancerepairneary.com",
        "datePublished": DATE,
        "dateModified": DATE,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": n.name,
          "addressRegion": "Ontario",
          "addressCountry": "CA"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "5200"
        },
        "areaServed": n.name,
        "openingHours": ["Mo-Sa 08:00-20:00", "Su 09:00-18:00"]
      },
      {
        "@type": "Service",
        "name": `${s.fullName} Repair in ${n.name}`,
        "provider": { "@type": "LocalBusiness", "name": "Appliance Repair Near Me" },
        "areaServed": n.name,
        "offers": {
          "@type": "Offer",
          "priceRange": s.priceRange,
          "description": `${s.fullName} repair in ${n.name} \u2014 same-day service, 90-day warranty`
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    ]
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${DOMAIN}/` },
      { "@type": "ListItem", "position": 2, "name": `${s.fullName} Repair Near Me`, "item": `${DOMAIN}/${s.servicePageSlug}.html` },
      { "@type": "ListItem", "position": 3, "name": `${s.fullName} Repair in ${n.name}`, "item": `${canonical}.html` }
    ]
  }, null, 2);

  const faqAnswerSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Who does ${s.altName.toLowerCase()} repair in ${n.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": quickAnswer
        }
      },
      {
        "@type": "Question",
        "name": `How much does ${s.altName.toLowerCase()} repair cost in ${n.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${s.fullName} repair in ${n.name} typically costs ${s.priceRange} depending on the brand and issue. Appliance Repair Neary provides upfront pricing before work begins. Call ${PHONE} for a free estimate.`
        }
      }
    ]
  });

  // Problem cards
  const problemCards = s.commonProblems.map((p, i) =>
    `      <div class="problem-card reveal"${i > 0 ? ` style="transition-delay:.${String(i*5).padStart(2,'0')}s"` : ''}>
        <span class="problem-icon">${p.icon}</span>
        <div class="problem-title">${p.title}</div>
        <p class="problem-desc">${p.desc}</p>
      </div>`
  ).join('\n');

  // Pricing rows
  const pricingRows = s.pricingRows.map(r =>
    `        <tr>
          <td>${r[0]}</td>
          <td class="price-val">${r[1]}</td>
          <td>${r[2]}</td>
          <td>${r[3]}</td>
        </tr>`
  ).join('\n');

  // FAQ items HTML
  const faqItems = faqs.map(f =>
    `<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${f.q}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${f.a}</p></div>
  </div>
</div>`
  ).join('\n\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">

  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_CA">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Rubik:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/tokens.css">

  <!-- Schema: LocalBusiness + Service + FAQ -->
  <script type="application/ld+json">
  ${schema}
  </script>

  <!-- Schema: BreadcrumbList -->
  <script type="application/ld+json">
  ${breadcrumbSchema}
  </script>

  <style>
    :root {
      --blue: #2196F3;
      --blue-mid: #1976D2;
      --blue-dark: #1565C0;
      --blue-light: #42A5F5;
      --navy: #0B1929;
      --white: #FFFFFF;
      --gray-50: #F8FAFC;
      --gray-100: #EEF2F7;
      --gray-200: #DDE5EF;
      --gray-400: #94A3B8;
      --gray-600: #64748B;
      --gray-800: #1E293B;
      --blue-bg: #EBF5FF;
      --blue-pale: #F0F7FF;
      --shadow-sm: 0 1px 4px rgba(33,150,243,.08);
      --shadow-md: 0 4px 16px rgba(33,150,243,.12);
      --shadow-lg: 0 8px 32px rgba(33,150,243,.16);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-xl: 28px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: "DM Sans", "Rubik", -apple-system, sans-serif; background: var(--white); color: var(--gray-800); line-height: 1.6; overflow-x: hidden; }
    h1, h2, h3, h4 { font-family: "Rubik", sans-serif; font-weight: 700; line-height: 1.2; }
    a { text-decoration: none; color: inherit; }
    img { max-width: 100%; display: block; }
    .container { max-width: 1160px; margin: 0 auto; padding: 0 24px; }
    .section-label { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--blue-mid); background: var(--blue-bg); border: 1px solid rgba(33,150,243,.2); padding: 4px 14px; border-radius: 100px; margin-bottom: 14px; }
    .section-title { font-size: clamp(22px, 3.5vw, 34px); color: var(--navy); margin-bottom: 12px; }
    .section-subtitle { font-size: 16px; color: var(--gray-600); }
    .section-header { margin-bottom: 40px; }
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity .5s ease, transform .5s ease; }
    .reveal.visible { opacity: 1; transform: none; }
    .btn-primary { display: inline-flex; align-items: center; gap: 8px; background: var(--blue-mid); color: #fff; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: var(--radius-md); transition: background .2s, transform .2s, box-shadow .2s; box-shadow: 0 4px 16px rgba(25,118,210,.3); white-space: nowrap; }
    .btn-primary:hover { background: var(--blue-dark); transform: translateY(-2px); }
    .btn-ghost { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: var(--blue-dark); font-size: 15px; font-weight: 600; padding: 13px 26px; border-radius: var(--radius-md); border: 2px solid var(--blue); transition: background .2s, color .2s, transform .2s; white-space: nowrap; }
    .btn-ghost:hover { background: var(--blue); color: #fff; transform: translateY(-2px); }
    .btn-green { display: inline-flex; align-items: center; gap: 8px; background: #27AE60; color: #fff; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: var(--radius-md); transition: background .2s, transform .2s, box-shadow .2s; box-shadow: 0 4px 16px rgba(39,174,96,.3); white-space: nowrap; }
    .btn-green:hover { background: #229954; transform: translateY(-2px); }

    /* BREADCRUMB */
    .breadcrumb-wrap { background: var(--gray-50); border-bottom: 1px solid var(--gray-200); padding: 12px 0; }
    .breadcrumb { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 13px; color: var(--gray-600); }
    .breadcrumb a { color: var(--blue-mid); }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb-sep { color: var(--gray-400); }

    /* PAGE HERO */
    .page-hero { background: var(--white); padding: 52px 0 44px; border-bottom: 1px solid var(--gray-200); position: relative; overflow: hidden; }
    .page-hero::before { content: ""; position: absolute; top: 0; left: 0; width: 300px; height: 4px; background: linear-gradient(90deg, var(--blue-dark), var(--blue-light), transparent); }
    .page-hero::after { content: ""; position: absolute; top: 0; right: 0; width: 45%; height: 100%; background: linear-gradient(135deg, var(--blue-pale) 0%, rgba(235,245,255,.3) 70%, transparent 100%); border-radius: 0 0 0 60px; z-index: 0; }
    .page-hero-inner { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 340px; gap: 48px; align-items: start; }
    .page-hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--blue-bg); border: 1px solid rgba(33,150,243,.25); border-radius: 100px; padding: 5px 14px 5px 10px; margin-bottom: 18px; font-size: 12px; font-weight: 600; color: var(--blue-dark); }
    .page-hero-badge-dot { width: 7px; height: 7px; background: #4CAF50; border-radius: 50%; animation: pulse-dot 2s ease-in-out infinite; }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.6;transform:scale(1.35);} }
    .page-hero h1 { font-size: clamp(24px, 4vw, 44px); color: var(--navy); margin-bottom: 16px; }
    .page-hero h1 .accent { color: var(--blue-mid); }

    /* ANSWER BOX */
    .answer-box { background: var(--blue-pale); border: 1px solid rgba(33,150,243,.2); border-left: 4px solid var(--blue-mid); border-radius: var(--radius-md); padding: 20px 24px; margin: 20px 0 28px; }
    .answer-box p { font-size: 15px; color: var(--gray-800); line-height: 1.7; }

    /* Page Hero CTA */
    .page-hero-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }

    /* Side Contact Card */
    .side-contact-card { background: var(--white); border: 2px solid rgba(33,150,243,.2); border-radius: var(--radius-lg); padding: 28px 24px; box-shadow: var(--shadow-md); position: sticky; top: 80px; }
    .side-contact-card h3 { font-size: 18px; color: var(--navy); margin-bottom: 6px; }
    .side-contact-card p { font-size: 13px; color: var(--gray-600); margin-bottom: 20px; }
    .side-phone { font-family: "Rubik", sans-serif; font-size: 26px; font-weight: 800; color: var(--blue-mid); display: block; margin-bottom: 12px; }
    .side-phone:hover { color: var(--blue-dark); }
    .side-trust-list { list-style: none; display: flex; flex-direction: column; gap: 8px; margin: 20px 0 0; }
    .side-trust-list li { font-size: 13px; color: var(--gray-600); display: flex; align-items: center; gap: 8px; }
    .side-trust-list li::before { content: "\\2713"; color: #27AE60; font-weight: 700; flex-shrink: 0; }

    /* TRUST BAR */
    .page-trust-bar { background: var(--gray-50); border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); padding: 28px 0; }
    .page-trust-pills { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
    .page-trust-pill { display: inline-flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid var(--gray-200); border-radius: 100px; padding: 8px 18px; font-size: 14px; font-weight: 600; color: var(--gray-800); box-shadow: var(--shadow-sm); }

    /* CONTENT SECTION */
    .content-section { padding: 64px 0; background: var(--white); }
    .content-cols { display: grid; grid-template-columns: 1fr 340px; gap: 48px; align-items: start; }
    .content-body { font-size: 15px; line-height: 1.8; color: var(--gray-600); }
    .content-body h2 { font-size: clamp(20px, 3vw, 28px); color: var(--navy); margin: 32px 0 14px; }
    .content-body h2:first-child { margin-top: 0; }
    .content-body h3 { font-size: 18px; color: var(--navy); margin: 24px 0 10px; }
    .content-body p { margin-bottom: 16px; }
    .content-body ul { margin: 0 0 16px 20px; }
    .content-body li { margin-bottom: 6px; }

    /* COMMON PROBLEMS */
    .problems-section { padding: 64px 0; background: var(--gray-50); }
    .problems-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
    .problem-card { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 22px 20px; box-shadow: var(--shadow-sm); transition: transform .2s, box-shadow .2s; }
    .problem-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .problem-icon { font-size: 28px; display: block; margin-bottom: 10px; }
    .problem-title { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 6px; }
    .problem-desc { font-size: 13px; color: var(--gray-600); line-height: 1.55; }

    /* PRICING TABLE */
    .pricing-section { padding: 64px 0; background: var(--white); }
    .pricing-table { width: 100%; border-collapse: collapse; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md); }
    .pricing-table thead { background: var(--blue-mid); color: #fff; }
    .pricing-table thead th { padding: 16px 20px; text-align: left; font-size: 14px; font-weight: 600; }
    .pricing-table tbody tr { border-bottom: 1px solid var(--gray-100); }
    .pricing-table tbody tr:last-child { border-bottom: none; }
    .pricing-table tbody tr:nth-child(even) { background: var(--gray-50); }
    .pricing-table tbody td { padding: 14px 20px; font-size: 14px; color: var(--gray-800); }
    .pricing-table tbody td:first-child { font-weight: 600; color: var(--navy); }
    .pricing-table .price-val { color: var(--blue-mid); font-weight: 700; }
    .pricing-note { margin-top: 16px; font-size: 13px; color: var(--gray-400); text-align: center; }

    /* BOOKING */
    .booking-section { padding: 64px 0; background: var(--blue-pale); }
    .booking-inner { max-width: 860px; margin: 0 auto; text-align: center; }

    /* FAQ */
    .faq-section { padding: 64px 0; background: var(--gray-50); }
    .faq-list { display: flex; flex-direction: column; gap: 12px; max-width: 800px; }
    .faq-item { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); }
    .faq-question { width: 100%; background: none; border: none; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; gap: 14px; cursor: pointer; text-align: left; }
    .faq-question-text { font-size: 15px; font-weight: 600; color: var(--navy); }
    .faq-icon { width: 26px; height: 26px; border-radius: 50%; background: var(--blue-bg); color: var(--blue-mid); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 17px; font-weight: 700; transition: background .2s, color .2s, transform .3s; }
    .faq-item.open .faq-icon { background: var(--blue-mid); color: #fff; transform: rotate(45deg); }
    .faq-answer { max-height: 0; overflow: hidden; transition: max-height .35s ease; }
    .faq-item.open .faq-answer { max-height: 280px; }
    .faq-answer-inner { padding: 14px 22px 20px; font-size: 14px; color: var(--gray-600); line-height: 1.7; border-top: 1px solid var(--gray-100); }

    /* RELATED LINKS */
    .related-section { padding: 56px 0; background: var(--white); }
    .related-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; }
    .related-col h3 { font-size: 17px; font-weight: 700; color: var(--navy); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid var(--blue-bg); }
    .related-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .related-links a { font-size: 14px; color: var(--blue-mid); display: flex; align-items: center; gap: 6px; transition: color .2s; }
    .related-links a::before { content: "\\2192"; color: var(--blue-light); font-weight: 700; }
    .related-links a:hover { color: var(--blue-dark); }

    /* RESPONSIVE */
    @media (max-width: 900px) {
      .page-hero-inner { grid-template-columns: 1fr; }
      .side-contact-card { display: none; }
      .content-cols { grid-template-columns: 1fr; }
      .content-cols .side-contact-card { display: block; position: static; }
      .problems-grid { grid-template-columns: 1fr 1fr; }
      .related-grid { grid-template-columns: 1fr; gap: 28px; }
    }
    @media (max-width: 600px) {
      .page-hero { padding: 36px 0 32px; }
      .problems-grid { grid-template-columns: 1fr; }
      .pricing-table thead th:nth-child(3), .pricing-table tbody td:nth-child(3) { display: none; }
    }
  </style>

  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${metaDesc}">
</head>
<body>

<!-- Header -->
<div id="header-placeholder"></div>
<script src="/includes/header-loader.js" defer></script>

<!-- BREADCRUMB -->
<div class="breadcrumb-wrap">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="breadcrumb-sep">/</span>
      <a href="/services">Services</a>
      <span class="breadcrumb-sep">/</span>
      <span aria-current="page">${s.fullName} Repair Near You in ${n.name}</span>
    </nav>
  </div>
</div>

<!-- PAGE HERO -->
<section class="page-hero">
  <div class="container">
    <div class="page-hero-inner">
      <div>
        <div class="page-hero-badge">
          <span class="page-hero-badge-dot"></span>
          Near You Today &middot; Toronto &amp; GTA
        </div>
        <h1>${h1}</h1>

        <div class="answer-box" itemprop="description">
          <p>${answerBoxText}</p>
        </div>

        <div class="page-hero-cta">
          <a href="tel:${PHONE_LINK}" class="btn-green">&#128222;&nbsp; Call ${PHONE}</a>
          <a href="#booking" class="btn-ghost">Book Online &rarr;</a>
        </div>
      </div>

      <div class="side-contact-card">
        <h3>Get ${s.name} Repair Near You</h3>
        <p>Same-day service in ${n.name} and surrounding areas. Call now or book online.</p>
        <a href="tel:${PHONE_LINK}" class="side-phone">${PHONE}</a>
        <a href="tel:${PHONE_LINK}" class="btn-green" style="width:100%;justify-content:center;">&#128222; Call Now</a>
        <ul class="side-trust-list">
          <li>Same-day availability</li>
          <li>4.9&#9733; rated (5,200+ reviews)</li>
          <li>90-day warranty on all repairs</li>
          <li>Upfront pricing, no hidden fees</li>
          <li>Licensed and insured</li>
        </ul>
      </div>
    </div>
  </div>
</section>
<script type="application/ld+json">${faqAnswerSchema}</script>
<div class="answer-capsule" style="background:#E3F2FD;border-left:4px solid #1976D2;padding:1rem 1.25rem;margin:1rem auto;max-width:920px;border-radius:0 10px 10px 0;font-family:'Rubik',sans-serif" itemscope itemtype="https://schema.org/Service">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#1565C0;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#0D3B66;font-size:.9rem;line-height:1.6" itemprop="description">${quickAnswer}</p>
</div>

<!-- TRUST BAR -->
<div class="page-trust-bar">
  <div class="container">
    <div class="page-trust-pills">
      <span class="page-trust-pill">&#11088; 4.9 Star Rated</span>
      <span class="page-trust-pill">&#128295; 5,200+ Repairs</span>
      <span class="page-trust-pill">&#9889; Same-Day Service</span>
      <span class="page-trust-pill">&#128737; 90-Day Warranty</span>
      <span class="page-trust-pill">&#128204; Licensed &amp; Insured</span>
    </div>
  </div>
</div>

<!-- CONTENT -->
<section class="content-section">
  <div class="container">
    <div class="content-cols">
      <div class="content-body reveal">
${bodyContent}
      </div>
      <div class="side-contact-card reveal">
        <h3>Book ${s.name} Repair Near You</h3>
        <p>Available today in ${n.name} — typically arrive within 2\u20134 hours.</p>
        <a href="tel:${PHONE_LINK}" class="side-phone">${PHONE}</a>
        <a href="#booking" class="btn-primary" style="width:100%;justify-content:center;margin-bottom:10px;">&#128197; Book Online</a>
        <a href="tel:${PHONE_LINK}" class="btn-green" style="width:100%;justify-content:center;">&#128222; Call Now</a>
        <ul class="side-trust-list">
          <li>Same-day availability</li>
          <li>4.9&#9733; rated (5,200+ reviews)</li>
          <li>90-day warranty</li>
          <li>Upfront pricing</li>
          <li>Licensed &amp; insured</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- COMMON PROBLEMS -->
<section class="problems-section" id="problems">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Common Issues We Fix</span>
      <h2 class="section-title">${s.name} Problems We Repair Near You</h2>
      <p class="section-subtitle">Our technicians are equipped to diagnose and repair the most common issues on the first visit.</p>
    </div>
    <div class="problems-grid">
${problemCards}
    </div>
  </div>
</section>

<!-- PRICING TABLE -->
<section class="pricing-section" id="pricing">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Pricing Near You</span>
      <h2 class="section-title">${s.name} Repair Cost Near You</h2>
      <p class="section-subtitle">Transparent, upfront pricing — no surprises. We quote before we fix, always.</p>
    </div>
    <table class="pricing-table" role="table">
      <thead>
        <tr>
          <th>Repair Type</th>
          <th>Typical Cost</th>
          <th>Warranty</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
${pricingRows}
      </tbody>
    </table>
    <p class="pricing-note">Final price confirmed in writing before any work begins. No hidden fees. 90-day parts &amp; labour warranty on all repairs.</p>
  </div>
</section>

<!-- BOOKING -->
<section class="booking-section" id="booking">
  <div class="container">
    <div class="booking-inner">
      <span class="section-label">Online Booking</span>
      <h2 class="section-title" style="text-align:center;">Book ${s.name} Repair Near You</h2>
      <p style="color:var(--gray-600);margin-bottom:28px;font-size:15px;text-align:center;">Select a time that works — a certified technician near you will arrive and fix it right the first time.</p>
      <iframe
        src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true"
        style="width:100%;min-height:600px;border:none;border-radius:14px;box-shadow:var(--shadow-md);"
        title="Book ${s.name} Repair Near You"
        loading="lazy">
      </iframe>
      <p style="margin-top:14px;font-size:14px;color:var(--gray-400);text-align:center;">
        Prefer to call? <a href="tel:${PHONE_LINK}" style="color:var(--blue-mid);font-weight:600;">${PHONE}</a> &mdash; Mon&ndash;Sat 8am&ndash;8pm &middot; Sun 9am&ndash;6pm
      </p>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="faq-section" id="faq">
  <div class="container">
    <div class="section-header">
      <span class="section-label">FAQ</span>
      <h2 class="section-title">${s.name} Repair Near Me — Questions &amp; Answers</h2>
      <p class="section-subtitle">Common questions from customers looking for ${s.name.toLowerCase()} repair near them in ${n.name}.</p>
    </div>
    <div class="faq-list">

${faqItems}

    </div></div>
  </div>
</section>

<!-- RELATED PAGES -->
<section class="related-section" id="related">
  <div class="container">
    <div class="related-grid">
      <div class="related-col">
        <h3>Other Services Near ${n.name}</h3>
        <ul class="related-links">
          ${getOtherServicesInNeighbourhood(s.slug, n.slug)}
        </ul>
      </div>
      <div class="related-col">
        <h3>${s.fullName} Repair in Nearby Areas</h3>
        <ul class="related-links">
          ${getSameServiceNearby(s.slug)}
        </ul>
      </div>
      <div class="related-col">
        <h3>Brands We Service</h3>
        <ul class="related-links" style="list-style:none;padding-left:0"><li>Samsung</li>
<li>LG</li>
<li>Whirlpool</li>
<li>GE</li>
<li>Bosch</li>
<li>Frigidaire</li>
<li>Kenmore</li>
<li>Maytag</li>
<li>KitchenAid</li></ul>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<div id="footer-placeholder"></div>
<script src="/includes/footer-loader.js" defer></script>

<script>
  // Scroll reveal
  (function(){
    var ob = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("visible"); ob.unobserve(e.target); }
      });
    },{threshold:0.08});
    document.querySelectorAll(".reveal").forEach(function(el){ ob.observe(el); });
  })();

  // FAQ accordion
  (function(){
    document.querySelectorAll(".faq-question").forEach(function(btn){
      btn.addEventListener("click", function(){
        var item = btn.closest(".faq-item");
        var isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function(o){
          o.classList.remove("open");
          o.querySelector(".faq-question").setAttribute("aria-expanded","false");
        });
        if(!isOpen){ item.classList.add("open"); btn.setAttribute("aria-expanded","true"); }
      });
    });
  })();
</script>

</body>
</html>`;

  return { fileName, html };
}

// ─── MAIN ──────────────────────────────────────────────────
const outputDir = path.resolve(__dirname);
let created = [];

for (const n of neighbourhoods) {
  for (const s of services) {
    const { fileName, html } = buildPage(s, n);
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, html, 'utf8');
    created.push(fileName);
    console.log(`Created: ${fileName}`);
  }
}

console.log(`\nTotal files created: ${created.length}`);
console.log('\nFiles:');
created.forEach(f => console.log(`  ${f}`));
