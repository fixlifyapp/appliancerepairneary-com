#!/usr/bin/env node
/**
 * vary-install-sections.js — Vary the large shared bullet-list sections
 * in dishwasher-installation pages to increase uniqueness.
 *
 * Targets the "What Our Installation Service Includes" and
 * "Common Dishwasher Types We Install" sections which are identical
 * across all city pages except for city name swaps.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

function hashCity(city, max) {
  let h = 0;
  for (let i = 0; i < city.length; i++) {
    h = ((h << 5) - h + city.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % max;
}
function hashCity2(city, max) {
  let h = 7;
  for (let i = 0; i < city.length; i++) {
    h = ((h * 31) + city.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % max;
}

// ═══════════════════════════════════════════════════════════════════
// "What Our Installation Service Includes" — 8 variations
// Each rewrites the 6 bullet points with different wording/order
// ═══════════════════════════════════════════════════════════════════
const installStepsVariations = [
  // Variation 0 — Focus on sequence
  `<ul>
      <li><strong>Step 1: Disconnect and remove the old dishwasher</strong> — We safely disconnect the water supply, drain line, and electrical connection from your old unit. The old dishwasher is hauled away and disposed of responsibly so you do not have to arrange separate removal.</li>
      <li><strong>Step 2: Prepare the cabinet opening</strong> — We inspect the opening for any obstructions, verify the dimensions match your new unit, and ensure the flooring underneath is level and undamaged before positioning.</li>
      <li><strong>Step 3: Connect the water supply</strong> — A braided stainless steel supply line connects your new dishwasher to the hot water shutoff under the sink. We inspect the shutoff valve and replace it at no extra cost if it shows corrosion or fails to close fully.</li>
      <li><strong>Step 4: Route the drain hose properly</strong> — The drain hose is secured under the countertop with a high loop to prevent dirty water from siphoning back after a completed cycle. We connect it to your sink drain or garbage disposal.</li>
      <li><strong>Step 5: Make the electrical connection</strong> — We wire the dishwasher using the existing circuit, whether hardwired or plug-in, and verify proper grounding and circuit capacity before powering the unit on.</li>
      <li><strong>Step 6: Level, secure, and test</strong> — The leveling feet are adjusted until the unit sits perfectly flat, mounting brackets lock it to the countertop, and a full wash cycle confirms leak-free operation at every connection.</li>
    </ul>`,

  // Variation 1 — Focus on what homeowner gets
  `<ul>
      <li><strong>Complete old unit removal</strong> — Your existing dishwasher is disconnected from all supply lines, pulled from the cabinet, and removed from your home. No need to arrange a separate pickup or disposal service.</li>
      <li><strong>Professional water hookup</strong> — We use a new braided stainless steel supply hose and inspect the hot water valve under the sink. Corroded valves are replaced during the visit at no additional charge to ensure a leak-free connection.</li>
      <li><strong>Code-compliant drain connection</strong> — The drain hose is installed with a proper high loop and securely connected to the sink drain system. This configuration meets Ontario plumbing codes and prevents backflow.</li>
      <li><strong>Safe electrical work</strong> — Whether your kitchen has a dedicated dishwasher outlet or a hardwired junction box, we make the connection and verify the circuit is rated for the new unit. Ground fault testing is standard on every job.</li>
      <li><strong>Precision leveling and securing</strong> — An unlevel dishwasher causes drainage issues, door misalignment, and excessive vibration. We use a digital level and adjust all four feet, then bolt the unit to the countertop edge.</li>
      <li><strong>Verified with a live test cycle</strong> — We run a complete wash cycle while still on site and personally inspect every water connection, the drain pump operation, and the door seal. We do not leave until we are certain the installation is watertight.</li>
    </ul>`,

  // Variation 2 — Technical detail focus
  `<ul>
      <li><strong>Removal and haul-away of old unit</strong> — The existing dishwasher is disconnected at the water valve, drain connection, and electrical junction. All connections are properly capped or covered. We take the old unit with us.</li>
      <li><strong>Hot water supply connection</strong> — A 3/8-inch braided stainless steel supply hose rated for 125 PSI connects the dishwasher inlet to the under-sink hot water valve. Supply valves showing mineral deposits or drip are replaced with quarter-turn ball valves.</li>
      <li><strong>Drain line with anti-siphon loop</strong> — The corrugated drain hose routes to the sink tailpiece or disposal inlet with an air gap or high loop at countertop level. This prevents standing drain water from back-flowing into a clean dishwasher tub after each cycle.</li>
      <li><strong>Electrical connection and ground verification</strong> — The unit is connected to the dedicated 15A or 20A circuit via the existing junction box or GFCI receptacle. We verify continuity and ground integrity with a circuit tester before energizing.</li>
      <li><strong>Multi-point leveling</strong> — Front-to-back and side-to-side level is set using the adjustable feet and verified with a precision level. The dishwasher is then anchored to the underside of the countertop with L-brackets to prevent forward tipping.</li>
      <li><strong>Full-cycle operational test</strong> — A standard wash cycle runs from fill through wash, drain, and dry. We monitor supply line pressure, drain pump operation, spray arm rotation, and door gasket seal throughout the entire cycle.</li>
    </ul>`,

  // Variation 3 — Concise and benefit-focused
  `<ul>
      <li><strong>Old dishwasher removed and disposed</strong> — We handle disconnection, removal, and responsible disposal of your old unit. Your kitchen is left clean and ready for the new installation.</li>
      <li><strong>Water supply securely connected</strong> — A new stainless braided supply line ensures leak-free water delivery. We check the shutoff valve condition and swap it out if needed — included in the installation price.</li>
      <li><strong>Drain routed with backflow prevention</strong> — The drain hose connects to your kitchen drain with a code-compliant high loop. This one detail prevents the most common post-installation complaint: dirty water pooling in a clean dishwasher.</li>
      <li><strong>Electrical safely wired</strong> — Hardwired or plug-in, we connect the power and test the circuit for proper voltage, amperage, and grounding. No adapters, no extension cords, no shortcuts.</li>
      <li><strong>Leveled and anchored in place</strong> — An uneven dishwasher leaks, vibrates, and wears out faster. We level all four feet precisely and mount the unit to your countertop so it stays put for years.</li>
      <li><strong>Tested before we leave</strong> — A complete wash cycle runs while we watch. Every connection is inspected for leaks, the drain pump is verified, and we confirm the unit operates quietly and correctly.</li>
    </ul>`,

  // Variation 4 — Problem-prevention focus
  `<ul>
      <li><strong>Careful disconnection and removal</strong> — We shut off the water supply, disconnect the drain and electrical, and slide the old unit out without damaging your flooring or cabinets. The old dishwasher leaves with us.</li>
      <li><strong>Leak-proof water supply connection</strong> — A new braided stainless supply hose replaces any old rubber or copper line. We also test the shutoff valve — a dripping valve left unchecked during installation causes slow water damage behind the dishwasher.</li>
      <li><strong>Proper drain hose installation</strong> — Incorrect drain routing is the number one cause of dishwasher odour and standing water complaints. We install the high loop correctly and verify the drain connection at the sink is tight and unobstructed.</li>
      <li><strong>Electrical connection with safety testing</strong> — We connect the dishwasher to your existing circuit and test for ground faults, proper polarity, and adequate amperage. This protects both the appliance and your home electrical system.</li>
      <li><strong>Precision leveling to prevent vibration</strong> — Even a few millimetres off-level causes the dishwasher door to not seal properly and the unit to vibrate during drain cycles. We check level on both axes and adjust until perfect.</li>
      <li><strong>Live test cycle with leak inspection</strong> — The dishwasher runs a complete cycle with all connections exposed for visual inspection. We check for drips at every fitting, confirm spray arm rotation, and verify the drain clears completely.</li>
    </ul>`,

  // Variation 5 — Homeowner-friendly language
  `<ul>
      <li><strong>We take care of the old one</strong> — Your current dishwasher is disconnected, pulled out, and taken away. You do not need to arrange disposal or figure out how to get a heavy appliance to the curb.</li>
      <li><strong>Water line done right</strong> — We connect the new dishwasher to your hot water using a durable stainless steel hose. If the water valve under your sink is old or stiff, we swap it with a new one as part of the job.</li>
      <li><strong>Drain hose set up properly</strong> — The drain hose goes to your sink drain with the right routing to keep dirty water from flowing back in. This prevents the musty smell that happens when drainage is installed incorrectly.</li>
      <li><strong>Electrical connected safely</strong> — Whether your dishwasher plugs in or is wired directly, we handle the connection and make sure the circuit can support it. We check for ground faults before turning anything on.</li>
      <li><strong>Leveled so it sits perfectly</strong> — We adjust all the feet until the dishwasher is flat and stable, then fasten it to the countertop so it does not shift when the door opens or during heavy wash cycles.</li>
      <li><strong>Tested while we are still here</strong> — We run a full wash cycle and watch every connection for drips. The spray arms spin, the pump drains, and the door seals tight. We only leave when everything checks out.</li>
    </ul>`,

  // Variation 6 — Quality assurance focus
  `<ul>
      <li><strong>Old unit safely removed</strong> — Disconnection follows a specific sequence: water off, drain disconnected, electrical separated. This prevents spills, shorts, and damage to your kitchen during removal.</li>
      <li><strong>Supply line upgraded</strong> — Regardless of what was there before, we install a new braided stainless supply hose rated for residential water pressure. Rubber hoses from the original installation are a leading cause of kitchen flooding after 5-7 years.</li>
      <li><strong>Drain routing per code</strong> — Ontario plumbing standards require a high loop or air gap on dishwasher drains. We install this correctly every time — it prevents contaminated water from sitting in the tub between cycles.</li>
      <li><strong>Electrical verified and connected</strong> — Circuit capacity, ground continuity, and GFCI protection are checked before connecting the new unit. We never tap into an overloaded circuit or use improper wiring methods.</li>
      <li><strong>Four-point leveling and mount</strong> — Each leveling foot is individually adjusted and the unit is checked with a level on both planes. Countertop brackets prevent the dishwasher from tipping forward when the lower rack is fully loaded.</li>
      <li><strong>Operational test on site</strong> — We stay through a complete cycle. Fill, wash, drain, and dry phases are all observed. If anything is not right, we correct it before leaving your home.</li>
    </ul>`,

  // Variation 7 — Speed and efficiency focus
  `<ul>
      <li><strong>Fast removal of your old dishwasher</strong> — Our installers disconnect and remove the existing unit efficiently, typically in under 15 minutes. We protect your flooring during removal and take the old appliance with us.</li>
      <li><strong>New supply line installed</strong> — A factory-fresh braided stainless hose connects the dishwasher to hot water. We inspect the shutoff valve and replace it only if necessary — no unnecessary upselling on parts you do not need.</li>
      <li><strong>Drain connected with high loop</strong> — Proper drain routing takes just minutes when done by an experienced installer but prevents years of drainage issues. The high loop is secured under the counter and the hose connected to the drain at the sink.</li>
      <li><strong>Electrical hooked up</strong> — Our team handles both hardwired and plug-in configurations. The circuit is tested before and after connection to confirm safe operation. Most kitchens built after 1990 already have the correct circuit in place.</li>
      <li><strong>Leveled and secured firmly</strong> — We set all four feet with a bubble level and anchor the unit into position. A properly leveled dishwasher operates more quietly and the door seals evenly across the entire gasket.</li>
      <li><strong>Full test before sign-off</strong> — A complete wash cycle runs with our installer present. Water fill, spray arm operation, drain pump, and door seal are all verified. You sign off only when satisfied.</li>
    </ul>`,
];

// ═══════════════════════════════════════════════════════════════════
// "Common Dishwasher Types We Install" — 8 variations
// ═══════════════════════════════════════════════════════════════════
const dishwasherTypesVariations = [
  // Variation 0
  `<ul>
      <li><strong>Standard built-in (24-inch)</strong> — The most widely installed dishwasher format. Fits a standard cabinet opening and connects to under-sink plumbing. Samsung, LG, Bosch, Whirlpool, and GE all make 24-inch built-ins.</li>
      <li><strong>Panel-ready integrated</strong> — A custom door panel matching your cabinetry makes this dishwasher virtually invisible. Requires precise panel measurement and hinge adjustment. Brands: Bosch, Miele, KitchenAid.</li>
      <li><strong>Compact 18-inch</strong> — Built for smaller kitchens, condos, and secondary dishwasher locations. Same plumbing connections as a full-size unit but needs narrower cabinet space and different brackets.</li>
      <li><strong>Drawer-style dishwashers</strong> — Single or double drawer units from Fisher & Paykel that pull out rather than dropping down. Popular for butler pantries, wet bars, and as secondary units in large kitchens.</li>
    </ul>`,

  // Variation 1
  `<ul>
      <li><strong>Full-size built-in (24")</strong> — Slides into a standard kitchen cabinet cutout. Most residential dishwashers fall into this category. All major brands manufacture 24-inch models with varying feature levels from basic to premium.</li>
      <li><strong>Integrated panel-ready</strong> — Designed for kitchens where the dishwasher should blend with surrounding cabinetry. We fit the custom panel your cabinetmaker provides and adjust the door for flush alignment. Popular brands include Bosch 800 Series and Miele G7000.</li>
      <li><strong>Slim-line 18-inch</strong> — Ideal for apartments, condos, and galley kitchens where a full 24-inch model will not fit. Despite the smaller footprint, installation complexity is similar — the same water, drain, and electrical connections are required.</li>
      <li><strong>Double-drawer (Fisher & Paykel)</strong> — Two independent drawers that can run separately on different cycles. Each drawer installs at ergonomic height and requires unique mounting hardware different from traditional units.</li>
    </ul>`,

  // Variation 2
  `<ul>
      <li><strong>Freestanding 24-inch</strong> — The workhorse of residential kitchens. Drops into a standard undercounter opening and connects to existing hot water, drain, and electrical. Available from every major manufacturer including Samsung, Bosch, LG, and Whirlpool.</li>
      <li><strong>Custom-panel built-in</strong> — Accepts a furniture panel on the door to match your kitchen cabinets. Installation includes panel hanging, spring tension adjustment, and door alignment verification. Bosch, KitchenAid, and Miele are the leading panel-ready brands.</li>
      <li><strong>Space-saving 18-inch</strong> — Three inches narrower than standard, designed for tight kitchen layouts. Common in older homes, condominiums, and as supplementary units in large kitchens. Mounting brackets differ from standard-width models.</li>
      <li><strong>Drawer-pull dishwashers</strong> — Fisher & Paykel's single and double drawer configurations replace the traditional drop-door design. Ergonomic loading, independent operation per drawer, and unique installation requirements.</li>
    </ul>`,

  // Variation 3
  `<ul>
      <li><strong>Undercounter 24" built-in</strong> — The standard residential dishwasher. Installs beneath your countertop in a 24-inch cabinet bay. Connections include hot water supply, drain to sink, and dedicated electrical circuit. Every major brand manufactures this size.</li>
      <li><strong>Panel-overlay integrated</strong> — A cabinetry panel attaches to the door face, making the dishwasher match surrounding cabinets. Our installers fit the panel, adjust the door springs for the additional weight, and verify the latch engages correctly with the panel attached.</li>
      <li><strong>Narrow 18" compact</strong> — Fits where a full-size unit cannot. Same connection requirements as a 24-inch dishwasher but with specific compact-model mounting brackets and narrower supply line routing.</li>
      <li><strong>Drawer dishwashers (single/double)</strong> — Fisher & Paykel drawer models require a different installation approach than conventional dishwashers — the mounting is top-heavy and the supply line routing must accommodate the drawer slide mechanism.</li>
    </ul>`,

  // Variation 4
  `<ul>
      <li><strong>Standard 24-inch models</strong> — Found in the vast majority of residential kitchens. Brands like Samsung, LG, Bosch, GE, and Whirlpool offer models ranging from $400 to $2,000+. Installation is straightforward with existing connections.</li>
      <li><strong>Panel-ready premium models</strong> — Popular in high-end kitchen renovations. The dishwasher accepts a matching cabinet panel so it disappears into the kitchen design. Requires careful door weight balancing after panel installation. Bosch, Miele, and KitchenAid lead this segment.</li>
      <li><strong>18-inch slimline models</strong> — Essential for kitchens with limited cabinet space. Bosch and Miele offer the most popular 18-inch options. Installation requires slim-specific brackets and careful alignment in the narrower opening.</li>
      <li><strong>Fisher & Paykel drawer units</strong> — A fundamentally different dishwasher design with one or two pull-out drawers. Each drawer operates independently. Installation differs significantly from conventional drop-door models.</li>
    </ul>`,

  // Variation 5
  `<ul>
      <li><strong>Built-in standard width</strong> — 24 inches wide, designed for the cabinet bay left of or right of the sink. This is the installation type we perform most frequently. Connections are straightforward with modern plumbing and electrical setups.</li>
      <li><strong>Integrated with custom panel</strong> — The front panel matches your kitchen cabinets. We handle panel attachment, hinge spring adjustment for the extra weight, and door alignment so the panel sits flush with adjacent cabinet doors. Common in Bosch and Miele installations.</li>
      <li><strong>Compact 18-inch width</strong> — Specifically designed for smaller homes, condos, and secondary kitchen locations. While physically smaller, these units require the same water, drain, and electrical connections as full-size models.</li>
      <li><strong>Drawer configuration</strong> — Fisher & Paykel pioneered the dish drawer concept. Single and double drawer models offer ergonomic loading and the ability to run small loads efficiently. Mounting and connection differs from all other dishwasher types.</li>
    </ul>`,

  // Variation 6
  `<ul>
      <li><strong>Conventional undercounter (24")</strong> — The industry standard for residential kitchens. Available from Samsung, LG, Bosch, Whirlpool, GE, Frigidaire, and KitchenAid. Fits existing cabinet openings with standard plumbing connections.</li>
      <li><strong>Cabinet-matching integrated</strong> — Panel-ready dishwashers designed to disappear behind your cabinetry. Installation includes panel fitting, door spring recalibration, and gap-alignment with adjacent cabinets. Bosch 800 series and Miele are the top choices.</li>
      <li><strong>Narrow-body 18-inch</strong> — When 24 inches is too wide, the 18-inch option delivers full dishwashing capability in a smaller footprint. Ideal for condo kitchens, basement apartments, and galley layouts.</li>
      <li><strong>Pull-out drawer models</strong> — Fisher & Paykel's innovative drawer system allows single or double drawer installation. Each drawer requires its own mounting frame and has a unique supply line routing that differs from drop-door models.</li>
    </ul>`,

  // Variation 7
  `<ul>
      <li><strong>Full-size 24-inch undercounter</strong> — The default residential dishwasher size. Compatible with standard kitchen cabinet bays. Samsung, Bosch, LG, Whirlpool, GE, and KitchenAid all manufacture this size with various feature tiers.</li>
      <li><strong>Panel-ready for custom kitchens</strong> — Accepts a decorative front panel to blend with your cabinetry. We mount the panel, adjust spring tension for the added door weight, and fine-tune alignment so the dishwasher is visually seamless. Premium brands only: Bosch, Miele, KitchenAid.</li>
      <li><strong>18-inch compact</strong> — Three-quarters the width of a standard model, designed for kitchens with limited counter space. Same connection types but requires compact-specific mounting hardware. Popular in vintage homes and condos.</li>
      <li><strong>Double-drawer (Fisher & Paykel)</strong> — Two separate wash drawers that operate independently. Unique installation due to the drawer mechanism — supply lines and drainage must be routed around the slide tracks.</li>
    </ul>`,
];

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
function main() {
  const files = fs.readdirSync(ROOT).filter(f => f.startsWith('dishwasher-installation-') && f.endsWith('.html'));
  let updated = 0;

  for (const file of files) {
    const city = file.replace('dishwasher-installation-', '').replace('.html', '');
    if (!city || city === 'near-me') continue;

    const filePath = path.join(ROOT, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    const original = html;

    // 1. Replace "What Our Installation Service Includes" bullet list
    const stepsIdx = hashCity(city, installStepsVariations.length);
    const stepsRegex = /(<h2>What Our (?:Dishwasher )?Installation Service Includes<\/h2>\s*<p>[^<]*<\/p>\s*)<ul>[\s\S]*?<\/ul>/;
    if (stepsRegex.test(html)) {
      html = html.replace(stepsRegex, `$1${installStepsVariations[stepsIdx]}`);
    }

    // 2. Replace "Common Dishwasher Types We Install" bullet list
    const typesIdx = hashCity2(city, dishwasherTypesVariations.length);
    const typesRegex = /(<h2>Common Dishwasher Types We Install<\/h2>\s*<p>[^<]*<\/p>\s*)<ul>[\s\S]*?<\/ul>/;
    if (typesRegex.test(html)) {
      html = html.replace(typesRegex, `$1${dishwasherTypesVariations[typesIdx]}`);
    }

    if (html !== original) {
      fs.writeFileSync(filePath, html, 'utf-8');
      updated++;
      console.log(`  + ${file} (steps=${stepsIdx}, types=${typesIdx})`);
    }
  }

  console.log(`\n========================================`);
  console.log(`Dishwasher-Installation Section Variation`);
  console.log(`========================================`);
  console.log(`Updated: ${updated} pages`);
}

main();
