const fs = require('fs');
const path = require('path');

const PHONE = '(437) 524-1053';
const PHONE_LINK = '+14375241053';
const DOMAIN = 'https://appliancerepairneary.com';

const neighbourhoods = [
  {
    slug: 'willowdale',
    name: 'Willowdale',
    parent: 'North York',
    desc: 'Korean-Canadian community in North York with 1980s-2000s condos and townhouses. LG and Samsung are the dominant brands. Many high-rise buildings require elevator coordination for service visits.',
  },
  {
    slug: 'bayview-village',
    name: 'Bayview Village',
    parent: 'North York',
    desc: 'Upscale North York neighbourhood with 1950s-80s brick homes. Aging Maytag and Whirlpool appliances are common. Affluent homeowners prefer professional repair over replacement.',
  },
  {
    slug: 'don-mills',
    name: 'Don Mills',
    parent: 'North York',
    desc: "Canada's first planned suburb from the 1950s-60s. Mix of apartments, townhouses, and detached homes. Senior residents with aging Whirlpool, GE, and Kenmore appliances.",
  },
  {
    slug: 'forest-hill',
    name: 'Forest Hill',
    parent: 'Toronto',
    desc: 'One of Toronto\'s most prestigious neighbourhoods with $2M+ Victorian and Tudor homes. Miele, Sub-Zero, Wolf, and Bosch are the standard. Homeowners always repair rather than replace.',
  },
  {
    slug: 'rosedale',
    name: 'Rosedale',
    parent: 'Toronto',
    desc: "Toronto's most prestigious neighbourhood featuring Victorian and Edwardian mansions. Luxury appliances from Miele, Sub-Zero, and Wolf. High-value homes demand expert service.",
  },
  {
    slug: 'the-annex',
    name: 'The Annex',
    parent: 'Toronto',
    desc: 'University of Toronto neighbourhood with Victorian semis. Mix of renters and homeowners. GE, Whirlpool, and Samsung appliances. Many rental properties need reliable repair service.',
  },
  {
    slug: 'leslieville',
    name: 'Leslieville',
    parent: 'East Toronto',
    desc: 'Trendy East Toronto neighbourhood with renovated workers\' cottages. Smart LG and Samsung appliances popular with young families. Heavy washer and dryer usage.',
  },
  {
    slug: 'liberty-village',
    name: 'Liberty Village',
    parent: 'Toronto',
    desc: 'Modern condo district with young professionals. Compact Bosch, Samsung, and LG appliances. Stacked washer-dryers and built-in dishwashers are standard.',
  },
  {
    slug: 'riverdale',
    name: 'Riverdale',
    parent: 'East Toronto',
    desc: 'East Toronto neighbourhood with Victorian and Edwardian semis. Family-oriented with a mix of appliance brands. Many homes undergoing renovation.',
  },
  {
    slug: 'danforth-village',
    name: 'Danforth Village',
    parent: 'East Toronto',
    desc: 'Greek-Canadian community with older 1940s-60s homes. Whirlpool, GE, and Frigidaire appliances from 1990s renovations. Reliable, no-nonsense repair service valued.',
  },
];

const services = [
  {
    slug: 'fridge-repair',
    name: 'Fridge',
    full: 'Refrigerator',
    priceRange: '$150–$450',
    priceMin: '$150',
    priceMax: '$450',
    problems: [
      { icon: '&#128269;', title: 'Not Cooling', desc: 'Compressor, thermostat, or sealed system failure. We diagnose and repair on the first visit.' },
      { icon: '&#9889;', title: 'Error Codes', desc: 'We read all manufacturer fault codes and address the root cause — not just clear the code.' },
      { icon: '&#128166;', title: 'Water Leaking', desc: 'Defrost drain clogs, water line leaks, or condensation issues — found and fixed same day.' },
      { icon: '&#128308;', title: 'Strange Noises', desc: 'Clicking, buzzing, humming — caused by failing compressor, fan motor, or ice buildup.' },
      { icon: '&#127777;', title: 'Freezer Issues', desc: 'Over-freezing, not freezing, or frost buildup — thermostat, defrost heater, or fan problems.' },
      { icon: '&#128683;', title: 'Door Seal Problems', desc: 'Worn gaskets cause temperature loss and higher energy bills. Quick replacement available.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$150 – $220', '90 days', 'Thermostat, fan motor, door gasket'],
      ['Standard Repair', '$220 – $350', '90 days', 'Compressor relay, defrost system, control board'],
      ['Major Repair', '$350 – $450', '90 days', 'Sealed system, compressor replacement'],
    ],
  },
  {
    slug: 'washer-repair',
    name: 'Washer',
    full: 'Washing Machine',
    priceRange: '$120–$380',
    priceMin: '$120',
    priceMax: '$380',
    problems: [
      { icon: '&#128269;', title: 'Not Spinning', desc: 'Drive belt, motor coupling, or lid switch failure. Diagnosed and repaired same day.' },
      { icon: '&#9889;', title: 'Error Codes', desc: 'We decode all Samsung, LG, Whirlpool fault codes and fix the root cause on site.' },
      { icon: '&#128166;', title: 'Leaking Water', desc: 'Hose connections, pump seals, tub gasket failures — located and fixed on first visit.' },
      { icon: '&#128308;', title: 'Loud Banging', desc: 'Unbalanced drum, worn shock absorbers, or loose counterweight. We fix it right.' },
      { icon: '&#127777;', title: 'Not Filling', desc: 'Inlet valve, water pressure, or control board issues — diagnosed and repaired quickly.' },
      { icon: '&#128683;', title: 'Door Won\'t Lock', desc: 'Broken latch, interlock switch, or wiring fault. Fast replacement with quality parts.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$120 – $190', '90 days', 'Belt, lid switch, inlet valve, hose'],
      ['Standard Repair', '$190 – $290', '90 days', 'Pump, motor coupling, door lock, board'],
      ['Major Repair', '$290 – $380', '90 days', 'Drive motor, transmission, tub bearing'],
    ],
  },
  {
    slug: 'dryer-repair',
    name: 'Dryer',
    full: 'Dryer',
    priceRange: '$110–$350',
    priceMin: '$110',
    priceMax: '$350',
    problems: [
      { icon: '&#128269;', title: 'Not Heating', desc: 'Heating element, thermal fuse, or gas igniter failure. We diagnose and repair same day.' },
      { icon: '&#9889;', title: 'Error Codes', desc: 'We read all manufacturer fault codes and fix the underlying issue — not just reset it.' },
      { icon: '&#128308;', title: 'Loud Squealing', desc: 'Worn drum rollers, belt, or idler pulley. Common wear items replaced on first visit.' },
      { icon: '&#127777;', title: 'Takes Too Long', desc: 'Clogged vent, failed thermostat, or broken moisture sensor. Proper diagnosis saves energy.' },
      { icon: '&#128683;', title: 'Won\'t Start', desc: 'Door switch, start switch, thermal fuse, or control board. Diagnosed quickly on site.' },
      { icon: '&#128166;', title: 'Drum Not Turning', desc: 'Broken belt, worn rollers, or motor issue. Fast repair with parts on hand.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$110 – $175', '90 days', 'Belt, thermostat, fuse, rollers'],
      ['Standard Repair', '$175 – $265', '90 days', 'Heating element, igniter, moisture sensor'],
      ['Major Repair', '$265 – $350', '90 days', 'Motor, control board, gas valve'],
    ],
  },
  {
    slug: 'dishwasher-repair',
    name: 'Dishwasher',
    full: 'Dishwasher',
    priceRange: '$120–$350',
    priceMin: '$120',
    priceMax: '$350',
    problems: [
      { icon: '&#128269;', title: 'Not Turning On', desc: 'Power board, thermal fuse, or control module failure. Diagnosed and repaired first visit.' },
      { icon: '&#9889;', title: 'Error Codes', desc: 'We read all manufacturer fault codes and address the root cause — not just clear the code.' },
      { icon: '&#128166;', title: 'Leaking Water', desc: 'Door seals, hose connections, pump seal failures — found and fixed same day.' },
      { icon: '&#128308;', title: 'Not Draining', desc: 'Drain pump, clogged filter, or blocked hose. Cleared and tested on first visit.' },
      { icon: '&#127777;', title: 'Not Cleaning Well', desc: 'Spray arm clogs, inlet valve issues, or detergent dispenser faults. Thorough diagnosis.' },
      { icon: '&#128683;', title: 'Door Latch Issues', desc: 'Broken latch or strike plate. Fast replacement with OEM-quality parts.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$120 – $180', '90 days', 'Switch, sensor, latch, hose'],
      ['Standard Repair', '$180 – $280', '90 days', 'Pump, motor, door seal, board'],
      ['Major Repair', '$280 – $350', '90 days', 'Control board, spray assembly, tub'],
    ],
  },
  {
    slug: 'oven-repair',
    name: 'Oven',
    full: 'Oven',
    priceRange: '$130–$400',
    priceMin: '$130',
    priceMax: '$400',
    problems: [
      { icon: '&#128269;', title: 'Not Heating', desc: 'Bake or broil element, igniter, or thermostat failure. Diagnosed and fixed same day.' },
      { icon: '&#9889;', title: 'Error Codes', desc: 'We decode all oven fault codes and repair the root cause — not just clear the display.' },
      { icon: '&#127777;', title: 'Uneven Cooking', desc: 'Convection fan, temperature sensor, or calibration issues. Proper diagnosis on first visit.' },
      { icon: '&#128308;', title: 'Strange Smells', desc: 'Gas leak detection, burnt wiring, or insulation issues. Safety-first approach always.' },
      { icon: '&#128683;', title: 'Door Won\'t Close', desc: 'Hinge, latch, or self-clean lock mechanism. Fast replacement available.' },
      { icon: '&#128166;', title: 'Self-Clean Failure', desc: 'Lock mechanism, thermal fuse, or control board issue. Expert repair on site.' },
    ],
    pricingRows: [
      ['Diagnostic Visit', '$0 – $85', 'N/A', 'Waived when repair is booked'],
      ['Minor Repair', '$130 – $200', '90 days', 'Igniter, thermostat, door hinge, gasket'],
      ['Standard Repair', '$200 – $310', '90 days', 'Element, fan motor, temperature sensor'],
      ['Major Repair', '$310 – $400', '90 days', 'Control board, gas valve, convection system'],
    ],
  },
];

// Unique content data for each neighbourhood+service combo
function getContent(nb, svc) {
  const contents = {
    willowdale: {
      'fridge-repair': {
        heroAnswer: `Willowdale fridge repair by Appliance Repair Near Me: same-day service for Willowdale's high-rise condos and townhouses in North York. We fix Samsung, LG, and Whirlpool refrigerators not cooling, leaking, making noise, or showing error codes. Typical cost ${svc.priceRange}. 90-day warranty. Call ${PHONE}.`,
        mainH2: 'Willowdale Fridge Repair — Same-Day Service for North York Condos and Townhouses',
        mainContent: `<p>Willowdale is one of North York's most dynamic neighbourhoods, stretching along Yonge Street from Sheppard to Finch. The area's Korean-Canadian community has grown substantially since the 1990s, and the housing stock reflects decades of development: 1960s low-rise apartments along Beecroft Road, 1980s-era townhouse complexes near Empress Walk, and the wave of high-rise condominiums built from 2000 onward along the Yonge-Sheppard corridor. Each housing type creates distinct refrigerator repair challenges that our Willowdale technicians handle daily.</p>

<p>The condo towers along Yonge Street between Sheppard and Finch — including the Avondale, 18 Yonge, and the Hullmark Centre residences — were typically fitted with Samsung or LG refrigerators by the builder. These units develop predictable failure patterns after 5-8 years of use. Samsung French door models in Willowdale condos commonly display the 22E and 41E error codes related to the ice maker fan motor and defrost sensor. LG linear compressor refrigerators show the ER IF and ER FF codes from the evaporator fan and fresh food sensor circuits. Our Willowdale dispatch carries replacement parts for both brands on every call, and our technicians are familiar with the building access protocols for major Willowdale condo corporations — reducing lobby wait times and getting to your unit faster.</p>

<p>Willowdale's older townhouse complexes — particularly those along Doris Avenue, Kenneth Avenue, and near Churchill Avenue — house 1990s-era Whirlpool and GE refrigerators that are now reaching end-of-service-life decisions. The most common failures in these ageing units include compressor relay clicking (the fridge tries to start but shuts off after a few seconds), condenser coil dust accumulation causing poor cooling performance, and door gasket deterioration that allows warm air infiltration. For a Whirlpool or GE refrigerator that has served a Willowdale family for 15-20 years, our technicians provide an honest cost-benefit analysis: if the repair cost exceeds 40% of a comparable new unit, we recommend replacement rather than upselling a repair.</p>

<p>Willowdale residents in the Korean-Canadian community often use kimchi refrigerators alongside standard units. While we primarily service conventional refrigerators, our technicians understand the dual-appliance kitchen configurations common in Willowdale homes and can advise on power load and ventilation considerations when servicing the primary refrigerator in a two-unit setup.</p>

<p><strong>Willowdale Fridge Tip:</strong> High-rise condos along the Yonge-Sheppard corridor have limited ventilation space behind counter-depth refrigerators. If your Willowdale condo fridge runs constantly or the sides feel excessively warm, check that at least 1 inch of clearance exists between the condenser coils and the wall. Builder installations sometimes push the unit too far back, restricting airflow and shortening compressor life.</p>`,
        faqs: [
          { q: 'Is there a fridge repair technician near me in Willowdale?', a: 'Yes. Appliance Repair Near Me dispatches technicians from North York locations near Yonge and Sheppard. For Willowdale addresses along the Yonge corridor, Doris Avenue, or Beecroft Road, we typically arrive within 2-3 hours of your call.' },
          { q: 'How much does fridge repair cost in Willowdale?', a: `Fridge repair in Willowdale costs ${svc.priceRange}. Samsung and LG condo refrigerator repairs (fan motor, defrost sensor, ice maker) run $150-$280. Older Whirlpool and GE compressor relay repairs run $200-$350. Control board replacements run $250-$400.` },
          { q: 'Do Willowdale condo fridges have specific problems?', a: 'Yes. Builder-installed Samsung and LG refrigerators in Willowdale high-rises commonly develop ice maker fan failures and defrost sensor issues after 5-8 years. The confined installation space in condo kitchens also contributes to condenser overheating.' },
          { q: 'What fridge brands are most common in Willowdale?', a: 'Willowdale condo towers along Yonge Street predominantly have Samsung and LG refrigerators. Older townhouses near Doris and Kenneth Avenues have Whirlpool and GE units from 1990s-2000s renovations. We carry parts for all four brands.' },
          { q: 'Can you repair a fridge in a Willowdale high-rise condo?', a: 'Absolutely. Our technicians are experienced with Willowdale condo building access protocols, elevator booking requirements, and the compact kitchen configurations typical of units along the Yonge-Sheppard corridor.' },
          { q: 'Is there a warranty on fridge repairs in Willowdale?', a: 'Every Willowdale fridge repair includes a 90-day parts and labour warranty. If the same issue returns within 90 days, we fix it at no additional charge.' },
        ],
      },
      'washer-repair': {
        heroAnswer: `Willowdale washer repair by Appliance Repair Near Me: same-day service for Willowdale's condos and townhouses in North York. We fix Samsung, LG, and Whirlpool washers not spinning, leaking, vibrating, or showing error codes. Typical cost ${svc.priceRange}. 90-day warranty. Call ${PHONE}.`,
        mainH2: 'Willowdale Washer Repair — Same-Day Service for North York High-Rises and Townhomes',
        mainContent: `<p>Willowdale's residential landscape along the Yonge-Sheppard corridor presents unique washer repair demands. The neighbourhood's high-rise condo towers — built primarily between 2000 and 2020 — feature compact stacked or front-load washing machines installed by builders. Meanwhile, the older townhouse complexes along Doris Avenue and Kenneth Avenue house full-size top-load and front-load units that serve multi-generational Willowdale families. Our technicians service both configurations daily and carry parts for the Samsung, LG, and Whirlpool machines that dominate Willowdale laundry rooms.</p>

<p>Stacked washer-dryer units in Willowdale condos create specific repair challenges. Samsung WF42 and WF45 series front-loaders, common in buildings like the Hullmark Centre and North York Centre condos, develop the 4C water supply error and the UE unbalanced load error at higher rates than freestanding installations. The vibration from an unbalanced load in a stacked configuration transfers directly to the dryer above and can loosen mounting brackets over time. LG WM series washers in Willowdale condos show the OE drain error and the LE motor error — both related to the compact drain hose routing required in condo utility closets where the drain standpipe is often further from the machine than ideal. Our Willowdale technicians carry extended drain hoses and anti-vibration pads on every condo dispatch.</p>

<p>Willowdale's townhouse residents along the Beecroft Road and Churchill Avenue corridors typically have full-size Whirlpool or Maytag washers installed during 2000s kitchen renovations. These machines are now 15-20 years old and show predictable wear patterns: Whirlpool drive belt stretching causing slow or incomplete spin cycles, water inlet valve calcification from Toronto's moderately hard water supply, and lid switch failures on top-load models that prevent the spin cycle from engaging. All are single-visit repairs with parts carried on our North York truck.</p>

<p>The Korean-Canadian families in Willowdale often run washers at higher frequency than the neighbourhood average — daily loads for multi-generational households are common. This accelerates wear on bearings, door gaskets, and drain pumps. Our technicians factor usage intensity into repair-versus-replace recommendations. A machine running 10+ loads per week may warrant bearing replacement even at 8 years old, while the same machine running 4 loads weekly would likely be better served by a simpler fix.</p>

<p><strong>Willowdale Washer Tip:</strong> If your Willowdale condo washer vibrates excessively during spin cycles, check that the transit bolts were removed during original installation. We find that approximately 1 in 15 condo washer service calls in the Yonge-Sheppard corridor trace back to transit bolts that were never removed by the builder's installation crew — causing premature bearing wear and excessive noise.</p>`,
        faqs: [
          { q: 'Is there a washer repair technician near me in Willowdale?', a: 'Yes. We dispatch from North York locations close to Yonge and Sheppard. Willowdale residents along the Yonge corridor, Beecroft Road, or near Empress Walk typically see a technician within 2-3 hours.' },
          { q: 'How much does washer repair cost in Willowdale?', a: `Washer repair in Willowdale costs ${svc.priceRange}. Condo stacked washer repairs (drain pump, door gasket, unbalanced drum) run $140-$260. Full-size Whirlpool or Maytag repairs (belt, inlet valve, lid switch) run $120-$220. Motor or bearing replacement runs $250-$380.` },
          { q: 'Can you fix a stacked washer-dryer in a Willowdale condo?', a: 'Yes. Our technicians are experienced with the stacked Samsung, LG, and Bosch washer-dryer combos common in Willowdale high-rises. We understand the compact utility closet configurations and carry the specific tools needed for stacked unit access.' },
          { q: 'Why does my Willowdale condo washer vibrate so much?', a: 'Willowdale condo washers vibrate due to unreinforced flooring in utility closets, transit bolts left in from builder installation, or worn shock absorbers. We diagnose the exact cause and fix it — anti-vibration pads, bolt removal, or part replacement.' },
          { q: 'What washer brands are most common in Willowdale?', a: 'Samsung and LG dominate Willowdale condo towers. Older townhouses near Doris and Beecroft have Whirlpool and Maytag units. We carry parts for all brands on every Willowdale dispatch.' },
          { q: 'Is there a warranty on washer repairs in Willowdale?', a: 'Every Willowdale washer repair includes a 90-day parts and labour warranty. Same-issue callbacks within 90 days are fixed at no charge.' },
        ],
      },
      'dryer-repair': {
        heroAnswer: `Willowdale dryer repair by Appliance Repair Near Me: same-day service for condos and townhouses across North York. We fix Samsung, LG, and Whirlpool dryers not heating, not tumbling, making noise, or showing error codes. Typical cost ${svc.priceRange}. 90-day warranty. Call ${PHONE}.`,
        mainH2: 'Willowdale Dryer Repair — Expert Service for Condo Stacked Units and Full-Size Dryers',
        mainContent: `<p>Dryer repair in Willowdale requires technicians who understand both the compact condo configurations along the Yonge-Sheppard corridor and the full-size setups in the neighbourhood's older townhouses. Willowdale's housing mix — from the Hullmark Centre towers to the 1980s townhouse rows on Kenneth Avenue — means our technicians encounter Samsung condensation dryers, LG heat pump units, and traditional Whirlpool vented dryers all within the same service day. We carry parts for all three configurations on every North York dispatch.</p>

<p>Willowdale's condo dryers present challenges unique to high-rise living. The stacked Samsung DV and LG DLEX series units in towers along Yonge Street between Sheppard and Finch operate in utility closets with limited ventilation. Condensation dryers in these settings are prone to heat exchanger lint accumulation — the condenser coil collects lint that bypasses the primary filter, gradually reducing drying efficiency until clothes come out damp after a full cycle. LG heat pump dryers in newer Willowdale condos (2015+) develop the D80 and D90 flow sense errors from restricted exhaust paths in buildings where the shared vent duct system creates backpressure. Both issues are resolved on a single visit.</p>

<p>The vented dryers in Willowdale townhouses along Doris Avenue and Beecroft Road face a different problem set. These Whirlpool and Maytag units exhaust through wall or roof vents that accumulate lint over 10-15 years of use. A partially blocked vent forces the dryer to work harder, overheating the thermal fuse and cycling thermostat. Our Willowdale technicians check vent airflow on every dryer service call — not just the internal components — because a new thermal fuse installed without addressing the root cause of a blocked vent will simply fail again within months.</p>

<p>Multi-generational households in Willowdale's Korean-Canadian community often run dryers for extended hours daily. This accelerated usage pattern wears drum rollers, belts, and felt seals faster than typical residential usage. Our technicians recognize the signs of high-usage wear — a rhythmic thumping that worsens over weeks indicates flat-spotted drum rollers, while a squealing that appears during the first few minutes of a cycle and then diminishes points to a glazed belt. Both are same-visit repairs.</p>

<p><strong>Willowdale Dryer Tip:</strong> Condo dryers in Willowdale high-rises that use a shared vent system should have lint screens cleaned after every load and the condensation tray (if applicable) emptied weekly. If your condo dryer takes more than 60 minutes to dry a standard load, the issue is almost always restricted airflow — either internal lint buildup or shared vent backpressure — not a heating element failure.</p>`,
        faqs: [
          { q: 'Is there a dryer repair technician near me in Willowdale?', a: 'Yes. We dispatch from North York near Yonge and Sheppard. Willowdale residents typically see a technician within 2-3 hours for same-day dryer repair service.' },
          { q: 'How much does dryer repair cost in Willowdale?', a: `Dryer repair in Willowdale costs ${svc.priceRange}. Condo stacked dryer repairs (thermal fuse, condenser cleaning, belt) run $110-$220. Vented dryer repairs (heating element, rollers, thermostat) run $150-$280. Motor or control board replacement runs $250-$350.` },
          { q: 'Why is my Willowdale condo dryer taking so long to dry?', a: 'Willowdale condo dryers commonly underperform due to lint-clogged condenser coils (condensation models) or shared vent backpressure (vented models). Our technicians check both internal components and airflow path to find the actual cause.' },
          { q: 'Can you fix a stacked dryer in a Willowdale condo?', a: 'Yes. We service stacked Samsung, LG, and Bosch dryer units in Willowdale condos daily. Our technicians have the tools to safely access the dryer in stacked configurations without disconnecting the washer below.' },
          { q: 'What dryer brands are common in Willowdale?', a: 'Samsung and LG stacked units dominate Willowdale condo towers. Townhouses along Doris and Beecroft have Whirlpool and Maytag vented dryers. We carry parts for all brands.' },
          { q: 'Is there a warranty on dryer repairs in Willowdale?', a: 'Every Willowdale dryer repair includes a 90-day parts and labour warranty. If the same problem returns within 90 days, the follow-up repair is free.' },
        ],
      },
      'dishwasher-repair': {
        heroAnswer: `Willowdale dishwasher repair by Appliance Repair Near Me: same-day service for Willowdale condos and townhouses in North York. We fix Samsung, LG, and Bosch dishwashers not draining, leaking, not cleaning, or showing error codes. Typical cost ${svc.priceRange}. 90-day warranty. Call ${PHONE}.`,
        mainH2: 'Willowdale Dishwasher Repair — Same-Day Service for North York Condos and Homes',
        mainContent: `<p>Dishwasher repair demands in Willowdale reflect the neighbourhood's distinctive housing profile. The high-rise condo towers along the Yonge-Sheppard corridor — including developments at Avondale, Hullmark, and the North York Centre condominiums — feature builder-installed Samsung and LG panel-integrated dishwashers. The older townhouse rows along Kenneth Avenue, Doris Avenue, and near Churchill Park house freestanding Whirlpool and GE dishwashers from 1990s-2000s kitchen renovations. Our Willowdale technicians carry parts for all four brands and understand the distinct failure patterns each housing type produces.</p>

<p>Samsung dishwashers in Willowdale condos — particularly the DW80 and DW60 series — develop the 5E drain error and the HE heater error after 4-7 years. The 5E error in high-rise settings often relates to backpressure in shared drain stacks during peak usage hours (typically 7-9 PM when multiple units run dishwashers simultaneously). Our technicians verify whether the issue is internal (clogged drain pump filter) or building-related (shared stack backpressure) before recommending repairs. LG dishwashers in Willowdale condos show the OE drain error and the LE motor error — the OE code often traces to the check valve rather than the pump itself, a distinction that saves our customers the cost of an unnecessary pump replacement.</p>

<p>Willowdale's older townhouse dishwashers face wear-related failures. Whirlpool and GE units installed in the early 2000s are now showing control board relay failures (the dishwasher starts but stops mid-cycle), spray arm hub cracks that reduce water pressure to the upper rack, and door gasket hardening that causes slow leaks onto the kitchen floor. Our Willowdale technicians assess the overall condition of 15-20 year old units and provide honest guidance on whether a $200 repair makes sense for a machine that may need a $300 repair six months later.</p>

<p>Korean-Canadian households in Willowdale often use dishwashers for items beyond standard North American dishwasher loads — including ceramic bowls and specialized cookware that can block spray arms or shift during the wash cycle. Our technicians offer practical loading guidance when the root cause of poor cleaning performance is a usage pattern rather than a mechanical fault.</p>

<p><strong>Willowdale Dishwasher Tip:</strong> If your Willowdale condo dishwasher shows a drain error code but works fine on a second attempt, the issue is likely shared drain stack backpressure during peak evening hours. Try running your dishwasher during off-peak times (late night or midday) to confirm. If the error persists regardless of timing, the drain pump or check valve needs service — call us.</p>`,
        faqs: [
          { q: 'Is there a dishwasher repair technician near me in Willowdale?', a: 'Yes. We dispatch from North York locations near Yonge and Sheppard. Willowdale addresses along the Yonge corridor, Doris Avenue, or Beecroft Road typically see a technician within 2-3 hours.' },
          { q: 'How much does dishwasher repair cost in Willowdale?', a: `Dishwasher repair in Willowdale costs ${svc.priceRange}. Samsung and LG condo dishwasher repairs (drain pump, check valve, heater) run $130-$260. Whirlpool and GE repairs (control board, spray arm, gasket) run $150-$300.` },
          { q: 'Why does my Willowdale condo dishwasher show a drain error?', a: 'Condo dishwashers in Willowdale high-rises often show drain errors during peak evening hours due to shared drain stack backpressure. Our technicians distinguish between building plumbing issues and internal drain pump failures to avoid unnecessary repairs.' },
          { q: 'What dishwasher brands are most common in Willowdale?', a: 'Samsung and LG panel-integrated units dominate Willowdale condo towers. Townhouses along Doris and Kenneth have Whirlpool and GE freestanding units. We service all brands with parts on hand.' },
          { q: 'Can you repair a built-in dishwasher in a Willowdale condo?', a: 'Yes. Our technicians service panel-integrated Samsung, LG, and Bosch dishwashers in Willowdale condos. We understand the cabinet mounting and water line configurations typical of high-rise installations.' },
          { q: 'Is there a warranty on dishwasher repairs in Willowdale?', a: 'Every Willowdale dishwasher repair includes a 90-day parts and labour warranty. Same-issue returns within 90 days are repaired free of charge.' },
        ],
      },
      'oven-repair': {
        heroAnswer: `Willowdale oven repair by Appliance Repair Near Me: same-day service for condos and townhouses across North York. We fix Samsung, LG, Whirlpool, and GE ovens not heating, uneven cooking, showing error codes, or with faulty igniters. Typical cost ${svc.priceRange}. 90-day warranty. Call ${PHONE}.`,
        mainH2: 'Willowdale Oven Repair — Same-Day Service for North York Condo and Townhouse Kitchens',
        mainContent: `<p>Oven repair in Willowdale serves a diverse range of kitchen configurations — from the slide-in ranges in high-rise condo units along the Yonge-Sheppard corridor to the freestanding gas and electric ranges in the neighbourhood's older townhouses. Willowdale's Korean-Canadian community also frequently uses convection and steam ovens for traditional cooking methods, adding another dimension to our technicians' daily workload. We carry parts for Samsung, LG, Whirlpool, GE, and Bosch ovens on every North York dispatch.</p>

<p>Condo ovens in Willowdale present specific challenges. The Samsung NE and NX series slide-in ranges common in towers like the Hullmark Centre and Avondale condos develop the SE and E-08 error codes from the touch panel membrane and oven temperature sensor respectively. The compact installation space in condo kitchens — where the oven is flanked by cabinets on both sides with minimal clearance — accelerates heat-related control board failures. LG slide-in ranges in newer Willowdale condos show the F9 code from the oven door lock motor and the F3 code from open or shorted temperature sensors. Both repairs are completed in a single visit with parts on board.</p>

<p>Willowdale's townhouse kitchens along Kenneth Avenue, Doris Avenue, and Beecroft Road typically house freestanding Whirlpool or GE ranges from 2000s renovations. Gas models develop igniter degradation — the igniter glows but takes progressively longer to open the gas valve, eventually reaching a point where it does not get hot enough and the oven fails to light entirely. Electric models show bake element burnout (a visible crack or blister on the lower element) and broil element failure. For 15-20 year old ranges in Willowdale townhouses, our technicians assess whether a $150 element replacement is worthwhile given the overall condition of the appliance.</p>

<p>Korean-Canadian households in Willowdale may operate ovens at higher temperatures and for longer durations than typical North American usage — particularly during holiday cooking and traditional preparation. This accelerated use pattern wears temperature sensors and door gaskets faster. Our technicians calibrate oven temperature accuracy as part of every Willowdale service call, ensuring the displayed temperature matches actual cavity temperature within 10 degrees.</p>

<p><strong>Willowdale Oven Tip:</strong> If your Willowdale condo oven heats unevenly — burning food on one side while leaving the other undercooked — the issue is typically a failing convection fan motor rather than a heating element problem. The fan distributes heat evenly throughout the cavity, and when it slows or stops, hot spots develop. This is a straightforward repair that dramatically improves cooking results.</p>`,
        faqs: [
          { q: 'Is there an oven repair technician near me in Willowdale?', a: 'Yes. We dispatch oven repair technicians from North York near Yonge and Sheppard. Willowdale residents typically receive same-day service within 2-3 hours of calling.' },
          { q: 'How much does oven repair cost in Willowdale?', a: `Oven repair in Willowdale costs ${svc.priceRange}. Igniter replacements run $130-$200. Bake or broil element replacement costs $150-$250. Control board and temperature sensor repairs run $200-$400.` },
          { q: 'Can you fix a slide-in range in a Willowdale condo?', a: 'Yes. Our technicians regularly service Samsung, LG, and Bosch slide-in ranges in Willowdale condo kitchens. We understand the tight cabinet clearances and can access components without full unit removal in most cases.' },
          { q: 'Why does my oven take longer to preheat in my Willowdale home?', a: 'Slow preheating in Willowdale ovens is usually caused by a weakening igniter (gas models) or a failing bake element (electric models). Both are common wear items that degrade gradually over years of use. We test and replace them on the first visit.' },
          { q: 'Do you repair gas ovens in Willowdale?', a: 'Yes. We service both gas and electric ovens in Willowdale. Gas oven repairs include igniter replacement, gas valve repair, and thermocouple service. All gas work is performed by licensed technicians.' },
          { q: 'Is there a warranty on oven repairs in Willowdale?', a: 'Every Willowdale oven repair includes a 90-day parts and labour warranty. If the same issue recurs within 90 days, the follow-up visit is free.' },
        ],
      },
    },
  };

  // For neighbourhoods not yet in the detailed content map, generate from neighbourhood data
  const nbData = contents[nb.slug];
  if (nbData && nbData[svc.slug]) {
    return nbData[svc.slug];
  }

  // Generate content dynamically for remaining combos
  return generateDynamicContent(nb, svc);
}

function generateDynamicContent(nb, svc) {
  const housingTypes = {
    'bayview-village': { types: 'brick bungalows, split-levels, and ranch-style homes', era: '1950s-1980s', brands: 'Maytag, Whirlpool, and KitchenAid', speciality: 'Affluent Bayview Village homeowners invest in premium appliances and prefer expert repair over replacement. The neighbourhood\'s mature homes feature spacious kitchens with built-in appliance configurations that require careful service.' },
    'don-mills': { types: 'planned-community apartments, townhouses, and detached bungalows', era: '1950s-1960s', brands: 'Whirlpool, GE, and Kenmore', speciality: 'Don Mills was Canada\'s first master-planned community, and many original homes still stand. Senior residents rely on appliances that have served them for decades, and they value honest advice on repair versus replacement.' },
    'forest-hill': { types: 'Victorian mansions, Tudor estates, and luxury renovated homes', era: 'early 1900s to present', brands: 'Miele, Sub-Zero, Wolf, and Bosch', speciality: 'Forest Hill is one of Toronto\'s wealthiest enclaves. Homeowners with $2M+ properties invest in premium appliances and expect technicians with manufacturer-specific training and white-glove service.' },
    'rosedale': { types: 'Victorian and Edwardian mansions, Georgian estates, and heritage homes', era: '1860s-1930s', brands: 'Miele, Sub-Zero, Wolf, Bosch, and Gaggenau', speciality: 'Rosedale is Toronto\'s most prestigious residential neighbourhood. Heritage homes feature luxury kitchen renovations with high-end European appliances that demand specialist repair knowledge.' },
    'the-annex': { types: 'Victorian semis, Edwardian row houses, and converted multi-unit residences', era: '1880s-1920s', brands: 'GE, Whirlpool, Samsung, and Bosch', speciality: 'The Annex\'s proximity to the University of Toronto creates a unique mix of long-term homeowners and student renters. Landlords managing multi-unit conversions need reliable, fast appliance repair to maintain tenant satisfaction.' },
    'leslieville': { types: 'renovated workers\' cottages, Victorian semis, and new-build townhouses', era: '1890s-present', brands: 'Samsung, LG, Bosch, and Whirlpool', speciality: 'Leslieville\'s young families drive heavy appliance usage — multiple loads of laundry daily, dishwashers running twice a day, and fridges packed with fresh groceries. The neighbourhood\'s renovated homes feature modern smart appliances from Samsung and LG.' },
    'liberty-village': { types: 'modern condominiums, loft conversions, and purpose-built rental apartments', era: '2000s-present', brands: 'Bosch, Samsung, LG, and Blomberg', speciality: 'Liberty Village is a dense condo district populated by young professionals. Compact European-style appliances — including 24-inch dishwashers, ventless dryers, and counter-depth fridges — are the standard.' },
    'riverdale': { types: 'Victorian and Edwardian semis, detached homes, and recently renovated properties', era: '1880s-1920s', brands: 'Samsung, LG, Whirlpool, Bosch, and GE', speciality: 'Riverdale families are renovating century homes and installing a mix of modern and mid-range appliances. The neighbourhood\'s older plumbing and electrical systems can create unique installation challenges.' },
    'danforth-village': { types: 'post-war bungalows, 1940s-60s detached homes, and older semi-detached houses', era: '1940s-1960s', brands: 'Whirlpool, GE, Frigidaire, and Kenmore', speciality: 'Danforth Village\'s Greek-Canadian heritage is reflected in kitchens that work hard — daily cooking, large family meals, and appliances that run constantly. Older Whirlpool and GE units from 1990s renovations are reaching end-of-life decisions.' },
  };

  const applianceSpecific = {
    'fridge-repair': {
      issues: 'not cooling, leaking water, making strange noises, running constantly, or displaying error codes',
      commonFix: 'compressor relay, defrost system, thermostat, fan motor, and door gasket',
      tip: `Check your fridge\'s condenser coils — located at the back or bottom of the unit — every 6 months. Dust buildup on the coils forces the compressor to work harder, shortening its lifespan and increasing energy consumption.`,
    },
    'washer-repair': {
      issues: 'not spinning, leaking, vibrating excessively, not draining, or showing error codes',
      commonFix: 'drive belt, drain pump, door gasket, inlet valve, and motor coupling',
      tip: `Never overload your washing machine. Overloading stresses the drive motor, bearings, and suspension system. For front-loaders, fill to about 80% capacity. For top-loaders, leave enough room for clothes to move freely.`,
    },
    'dryer-repair': {
      issues: 'not heating, taking too long to dry, making squealing noises, not tumbling, or shutting off mid-cycle',
      commonFix: 'heating element, thermal fuse, drum rollers, belt, and moisture sensor',
      tip: `Clean your dryer\'s lint trap after every load and have the exhaust vent professionally cleaned annually. A clogged vent is the number one cause of dryer fires in Toronto and the most common reason dryers stop heating.`,
    },
    'dishwasher-repair': {
      issues: 'not draining, leaking, not cleaning dishes properly, not starting, or showing error codes',
      commonFix: 'drain pump, door gasket, spray arm, inlet valve, and control board',
      tip: `Run hot water at the kitchen sink before starting your dishwasher. This ensures the first fill cycle uses hot water rather than lukewarm water sitting in the pipes, which significantly improves cleaning performance.`,
    },
    'oven-repair': {
      issues: 'not heating, heating unevenly, not reaching temperature, igniter clicking, or displaying error codes',
      commonFix: 'bake element, igniter, thermostat, temperature sensor, and convection fan motor',
      tip: `If your oven temperature seems off, test it with a standalone oven thermometer before calling for service. A 25-degree variance is normal, but anything beyond that indicates a failing temperature sensor or thermostat that needs replacement.`,
    },
  };

  const h = housingTypes[nb.slug] || { types: 'various residential properties', era: 'mixed', brands: 'Samsung, LG, Whirlpool, and GE', speciality: `${nb.name} residents value reliable, same-day appliance repair service.` };
  const a = applianceSpecific[svc.slug];

  return {
    heroAnswer: `${nb.name} ${svc.name.toLowerCase()} repair by Appliance Repair Near Me: same-day service for ${h.types} in ${nb.parent}. We fix ${h.brands} ${svc.name.toLowerCase()}s ${a.issues}. Typical cost ${svc.priceRange}. 90-day warranty. Call ${PHONE}.`,
    mainH2: `${nb.name} ${svc.name} Repair — Same-Day Service for ${nb.parent} Homes and Residences`,
    mainContent: `<p>${nb.name} is a distinctive ${nb.parent} neighbourhood characterized by ${h.types} dating from the ${h.era}. ${nb.desc} Our ${nb.name} ${svc.name.toLowerCase()} repair technicians understand the specific housing stock, appliance brands, and repair challenges that define this community. When you call for ${svc.name.toLowerCase()} repair near you in ${nb.name}, we dispatch a technician who knows your neighbourhood — not a general dispatcher routing from across the GTA.</p>

<p>${h.speciality} The ${svc.name.toLowerCase()}s in ${nb.name} homes commonly present with ${a.issues}. Our technicians carry replacement parts for ${a.commonFix} repairs on every ${nb.name} dispatch, which means most repairs are completed on the first visit without waiting days for parts to arrive. For ${h.brands} ${svc.name.toLowerCase()}s — the brands most common in ${nb.name} — we maintain a deep inventory of the specific components that fail most frequently in ${h.era} installations.</p>

<p>The housing stock in ${nb.name} creates specific ${svc.name.toLowerCase()} repair considerations that technicians unfamiliar with the neighbourhood may not anticipate. Homes from the ${h.era} have particular plumbing configurations, electrical panel capacities, and kitchen layouts that affect how ${svc.name.toLowerCase()}s are installed and how they fail. Our ${nb.name} technicians have serviced hundreds of units in the area and recognize these patterns immediately — reducing diagnostic time and ensuring accurate first-visit repairs. Whether your ${nb.name} home has a compact condo kitchen or a spacious detached home layout, our technicians adapt their approach to your specific configuration.</p>

<p>We believe in transparent service for ${nb.name} residents. Before starting any repair, our technician provides a written quote that includes parts, labour, and the 90-day warranty. If the repair cost approaches the replacement value of the ${svc.name.toLowerCase()} — particularly for units over 12 years old — we tell you honestly. There is no incentive for our technicians to upsell repairs on appliances that are better replaced. Conversely, for premium ${h.brands} appliances common in ${nb.name}, repair almost always makes financial sense given the high replacement cost of these brands.</p>

<p><strong>${nb.name} ${svc.name} Tip:</strong> ${a.tip}</p>`,
    faqs: [
      { q: `Is there a ${svc.name.toLowerCase()} repair technician near me in ${nb.name}?`, a: `Yes. Appliance Repair Near Me dispatches from ${nb.parent} locations. ${nb.name} residents typically see a technician within 2-4 hours of calling for same-day service.` },
      { q: `How much does ${svc.name.toLowerCase()} repair cost in ${nb.name}?`, a: `${svc.name} repair in ${nb.name} typically costs ${svc.priceRange}. The exact price depends on the issue, brand, and parts required. Our technician provides a written quote before starting any work.` },
      { q: `What ${svc.name.toLowerCase()} brands do you service in ${nb.name}?`, a: `We service all major brands in ${nb.name} including ${h.brands}. The most common brands in ${nb.name}'s ${h.types} are ${h.brands}. We carry parts for all of them.` },
      { q: `Do you offer same-day ${svc.name.toLowerCase()} repair in ${nb.name}?`, a: `Yes. Same-day ${svc.name.toLowerCase()} repair is available in ${nb.name} when you call before 2 PM. We dispatch from nearby ${nb.parent} locations for fast arrival times.` },
      { q: `Is there a warranty on ${svc.name.toLowerCase()} repairs in ${nb.name}?`, a: `Every ${nb.name} ${svc.name.toLowerCase()} repair includes a 90-day parts and labour warranty. If the same issue returns within 90 days, the follow-up repair is at no charge.` },
      { q: `Can you repair a ${svc.name.toLowerCase()} in a ${nb.name} ${h.types.split(',')[0]}?`, a: `Absolutely. Our technicians are experienced with the ${h.era} housing configurations common in ${nb.name}. We understand the specific installation constraints and appliance brands typical of ${nb.name} residences.` },
    ],
  };
}

function buildPage(nb, svc) {
  const content = getContent(nb, svc);
  const fileName = `${svc.slug}-${nb.slug}.html`;
  const canonical = `${DOMAIN}/${fileName.replace('.html', '')}`;
  const title = `${svc.name} Repair Near Me in ${nb.name} | Appliance Repair Near Me`;
  const metaDesc = `${svc.name} repair near me in ${nb.name}. Same-day service. ${svc.priceRange}. 90-day warranty. Call ${PHONE}.`;
  const h1 = `${svc.name} Repair Near Me &mdash; ${nb.name}`;
  const dateNow = '2026-02-23';

  // Build FAQ HTML
  const faqHtml = content.faqs.map(f => `
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span class="faq-question-text">${f.q}</span>
    <span class="faq-icon">+</span>
  </button>
  <div class="faq-answer">
    <div class="faq-answer-inner"><p>${f.a}</p></div>
  </div>
</div>`).join('\n');

  // Build FAQ schema
  const faqSchema = content.faqs.map(f => `        {
          "@type": "Question",
          "name": "${f.q.replace(/"/g, '\\"')}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "${f.a.replace(/"/g, '\\"')}"
          }
        }`).join(',\n');

  // Build pricing rows
  const pricingHtml = svc.pricingRows.map(r => `        <tr>
          <td>${r[0]}</td>
          <td class="price-val">${r[1]}</td>
          <td>${r[2]}</td>
          <td>${r[3]}</td>
        </tr>`).join('\n');

  // Build problems
  const problemsHtml = svc.problems.map((p, i) => `      <div class="problem-card reveal"${i > 0 ? ` style="transition-delay:.${String(i * 5).padStart(2, '0')}s"` : ''}>
        <span class="problem-icon">${p.icon}</span>
        <div class="problem-title">${p.title}</div>
        <p class="problem-desc">${p.desc}</p>
      </div>`).join('\n');

  // Related services in same neighbourhood
  const otherServices = services.filter(s => s.slug !== svc.slug).map(s =>
    `<li><a href="/${s.slug}-${nb.slug}">${s.name} Repair in ${nb.name}</a></li>`
  ).join('\n');

  // Same service in other neighbourhoods
  const otherNeighbourhoods = neighbourhoods.filter(n => n.slug !== nb.slug).map(n =>
    `<li><a href="/${svc.slug}-${n.slug}">${svc.name} Repair in ${n.name}</a></li>`
  ).join('\n');

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

  <!-- Schema: LocalBusiness + Service + FAQPage -->
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "name": "Appliance Repair Near Me — ${nb.name}",
      "telephone": "${PHONE_LINK}",
      "url": "${DOMAIN}",
      "datePublished": "${dateNow}",
      "dateModified": "${dateNow}",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${nb.name}",
        "addressRegion": "Ontario",
        "addressCountry": "CA"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "5200"
      },
      "areaServed": "${nb.name}",
      "openingHours": [
        "Mo-Sa 08:00-20:00",
        "Su 09:00-18:00"
      ]
    },
    {
      "@type": "Service",
      "name": "${svc.name} Repair in ${nb.name}",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Appliance Repair Near Me"
      },
      "areaServed": "${nb.name}",
      "offers": {
        "@type": "Offer",
        "priceRange": "${svc.priceRange}",
        "description": "${svc.name} repair in ${nb.name} — same-day service, 90-day warranty"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
${faqSchema}
      ]
    }
  ]
}
  </script>

  <!-- Schema: BreadcrumbList -->
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "${DOMAIN}/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "${svc.name} Repair Near Me",
      "item": "${DOMAIN}/${svc.slug}-near-me.html"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "${svc.name} Repair in ${nb.name}",
      "item": "${canonical}"
    }
  ]
}
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
    .breadcrumb-wrap { background: var(--gray-50); border-bottom: 1px solid var(--gray-200); padding: 12px 0; }
    .breadcrumb { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; font-size: 13px; color: var(--gray-600); }
    .breadcrumb a { color: var(--blue-mid); }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb-sep { color: var(--gray-400); }
    .page-hero { background: var(--white); padding: 52px 0 44px; border-bottom: 1px solid var(--gray-200); position: relative; overflow: hidden; }
    .page-hero::before { content: ""; position: absolute; top: 0; left: 0; width: 300px; height: 4px; background: linear-gradient(90deg, var(--blue-dark), var(--blue-light), transparent); }
    .page-hero::after { content: ""; position: absolute; top: 0; right: 0; width: 45%; height: 100%; background: linear-gradient(135deg, var(--blue-pale) 0%, rgba(235,245,255,.3) 70%, transparent 100%); border-radius: 0 0 0 60px; z-index: 0; }
    .page-hero-inner { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 340px; gap: 48px; align-items: start; }
    .page-hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--blue-bg); border: 1px solid rgba(33,150,243,.25); border-radius: 100px; padding: 5px 14px 5px 10px; margin-bottom: 18px; font-size: 12px; font-weight: 600; color: var(--blue-dark); }
    .page-hero-badge-dot { width: 7px; height: 7px; background: #4CAF50; border-radius: 50%; animation: pulse-dot 2s ease-in-out infinite; }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.6;transform:scale(1.35);} }
    .page-hero h1 { font-size: clamp(24px, 4vw, 44px); color: var(--navy); margin-bottom: 16px; }
    .page-hero h1 .accent { color: var(--blue-mid); }
    .answer-box { background: var(--blue-pale); border: 1px solid rgba(33,150,243,.2); border-left: 4px solid var(--blue-mid); border-radius: var(--radius-md); padding: 20px 24px; margin: 20px 0 28px; }
    .answer-box p { font-size: 15px; color: var(--gray-800); line-height: 1.7; }
    .page-hero-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
    .side-contact-card { background: var(--white); border: 2px solid rgba(33,150,243,.2); border-radius: var(--radius-lg); padding: 28px 24px; box-shadow: var(--shadow-md); position: sticky; top: 80px; }
    .side-contact-card h3 { font-size: 18px; color: var(--navy); margin-bottom: 6px; }
    .side-contact-card p { font-size: 13px; color: var(--gray-600); margin-bottom: 20px; }
    .side-phone { font-family: "Rubik", sans-serif; font-size: 26px; font-weight: 800; color: var(--blue-mid); display: block; margin-bottom: 12px; }
    .side-phone:hover { color: var(--blue-dark); }
    .side-trust-list { list-style: none; display: flex; flex-direction: column; gap: 8px; margin: 20px 0 0; }
    .side-trust-list li { font-size: 13px; color: var(--gray-600); display: flex; align-items: center; gap: 8px; }
    .side-trust-list li::before { content: "\\2713"; color: #27AE60; font-weight: 700; flex-shrink: 0; }
    .page-trust-bar { background: var(--gray-50); border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); padding: 28px 0; }
    .page-trust-pills { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
    .page-trust-pill { display: inline-flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid var(--gray-200); border-radius: 100px; padding: 8px 18px; font-size: 14px; font-weight: 600; color: var(--gray-800); box-shadow: var(--shadow-sm); }
    .content-section { padding: 64px 0; background: var(--white); }
    .content-cols { display: grid; grid-template-columns: 1fr 340px; gap: 48px; align-items: start; }
    .content-body { font-size: 15px; line-height: 1.8; color: var(--gray-600); }
    .content-body h2 { font-size: clamp(20px, 3vw, 28px); color: var(--navy); margin: 32px 0 14px; }
    .content-body h2:first-child { margin-top: 0; }
    .content-body h3 { font-size: 18px; color: var(--navy); margin: 24px 0 10px; }
    .content-body p { margin-bottom: 16px; }
    .content-body ul { margin: 0 0 16px 20px; }
    .content-body li { margin-bottom: 6px; }
    .problems-section { padding: 64px 0; background: var(--gray-50); }
    .problems-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
    .problem-card { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 22px 20px; box-shadow: var(--shadow-sm); transition: transform .2s, box-shadow .2s; }
    .problem-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .problem-icon { font-size: 28px; display: block; margin-bottom: 10px; }
    .problem-title { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 6px; }
    .problem-desc { font-size: 13px; color: var(--gray-600); line-height: 1.55; }
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
    .booking-section { padding: 64px 0; background: var(--blue-pale); }
    .booking-inner { max-width: 860px; margin: 0 auto; text-align: center; }
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
    .related-section { padding: 56px 0; background: var(--white); }
    .related-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; }
    .related-col h3 { font-size: 17px; font-weight: 700; color: var(--navy); margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid var(--blue-bg); }
    .related-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .related-links a { font-size: 14px; color: var(--blue-mid); display: flex; align-items: center; gap: 6px; transition: color .2s; }
    .related-links a::before { content: "\\2192"; color: var(--blue-light); font-weight: 700; }
    .related-links a:hover { color: var(--blue-dark); }
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
      <span aria-current="page">${svc.name} Repair Near Me in ${nb.name}</span>
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
          Near You Today &middot; ${nb.name}
        </div>
        <h1>${h1}</h1>

        <div class="answer-box" itemprop="description">
          <p>${content.heroAnswer}</p>
        </div>

        <div class="page-hero-cta">
          <a href="tel:${PHONE_LINK}" class="btn-green">&#128222;&nbsp; Call ${PHONE}</a>
          <a href="#booking" class="btn-ghost">Book Online &rarr;</a>
        </div>
      </div>

      <div class="side-contact-card">
        <h3>Get ${svc.name} Repair Near You</h3>
        <p>Same-day service in ${nb.name}. Call now or book online.</p>
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

<!-- ANSWER CAPSULE -->
<div class="answer-capsule" style="background:#E3F2FD;border-left:4px solid #1976D2;padding:1rem 1.25rem;margin:1rem auto;max-width:920px;border-radius:0 10px 10px 0;font-family:'Rubik',sans-serif" itemscope itemtype="https://schema.org/Service">
  <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#1565C0;text-transform:uppercase;margin-bottom:.4rem">Quick Answer</div>
  <p style="margin:0;color:#0D3B66;font-size:.9rem;line-height:1.6" itemprop="description">Appliance Repair Near Me provides same-day ${svc.name.toLowerCase()} repair in ${nb.name}. Call ${PHONE} — available 7 days a week, including evenings. Typical cost ${svc.priceRange}. All major brands: Samsung, LG, Whirlpool, Bosch, GE, Maytag. Most repairs completed in 1-2 hours on the first visit. 90-day parts &amp; labour warranty.</p>
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
<h2>${content.mainH2}</h2>
${content.mainContent}
      </div>
      <div class="side-contact-card reveal">
        <h3>Book ${svc.name} Repair Near You</h3>
        <p>Available today in ${nb.name} — typically arrive within 2-4 hours.</p>
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
      <h2 class="section-title">${svc.name} Problems We Repair Near You in ${nb.name}</h2>
      <p class="section-subtitle">Our technicians are equipped to diagnose and repair the most common ${svc.name.toLowerCase()} issues on the first visit.</p>
    </div>
    <div class="problems-grid">
${problemsHtml}
    </div>
  </div>
</section>

<!-- PRICING TABLE -->
<section class="pricing-section" id="pricing">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Pricing Near You</span>
      <h2 class="section-title">${svc.name} Repair Cost in ${nb.name}</h2>
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
${pricingHtml}
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
      <h2 class="section-title" style="text-align:center;">Book ${svc.name} Repair in ${nb.name}</h2>
      <p style="color:var(--gray-600);margin-bottom:28px;font-size:15px;text-align:center;">Select a time that works — a certified technician near you will arrive and fix it right the first time.</p>
      <iframe
        src="https://hub.fixlify.app/book/nicks-appliance-repair-b8c8ce?embed=true"
        style="width:100%;min-height:600px;border:none;border-radius:14px;box-shadow:var(--shadow-md);"
        title="Book ${svc.name} Repair in ${nb.name}"
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
      <h2 class="section-title">${svc.name} Repair Near Me in ${nb.name} — Questions &amp; Answers</h2>
      <p class="section-subtitle">Common questions from customers looking for ${svc.name.toLowerCase()} repair near them in ${nb.name}.</p>
    </div>
    <div class="faq-list">
${faqHtml}
    </div>
  </div>
</section>

<!-- RELATED PAGES -->
<section class="related-section" id="related">
  <div class="container">
    <div class="related-grid">
      <div class="related-col">
        <h3>Other Services in ${nb.name}</h3>
        <ul class="related-links">
          ${otherServices}
        </ul>
      </div>
      <div class="related-col">
        <h3>${svc.name} Repair in Nearby Areas</h3>
        <ul class="related-links">
          ${otherNeighbourhoods}
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

// Generate all 50 pages
let created = [];
for (const nb of neighbourhoods) {
  for (const svc of services) {
    const { fileName, html } = buildPage(nb, svc);
    const filePath = path.join('C:/appliancerepairneary', fileName);
    fs.writeFileSync(filePath, html, 'utf8');
    created.push(fileName);
    console.log(`Created: ${fileName}`);
  }
}

console.log(`\nTotal files created: ${created.length}`);
console.log(created.join('\n'));
