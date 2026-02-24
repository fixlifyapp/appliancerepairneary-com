#!/usr/bin/env node
/**
 * Batch 2 — Inject extended content sections into oven, stove, washer pages
 * Inserts ~1,500 words of unique content per page BEFORE <section class="faq-section"
 */
const fs = require('fs');
const path = require('path');

const DIR = 'C:/appliancerepairneary';
const PHONE = '(437) 524-1053';
const PHONE_LINK = 'tel:+14375241053';
const H2_STYLE = 'style="font-size:clamp(18px,2.5vw,26px);color:#1E3A5F;margin:32px 0 12px;font-weight:700;"';

// City context data
const cityData = {
  'toronto': {
    name: 'Toronto',
    housing: 'Victorian semis, Edwardian rowhouses, post-war bungalows in East York, and modern glass-tower condominiums along the waterfront',
    character: 'diverse neighbourhoods from the Annex to Scarborough, busy professionals and families in one of North America\'s most densely populated cities',
    demographics: 'a diverse, fast-paced population of busy professionals, young families, and long-time residents across hundreds of distinct neighbourhoods',
    waterNote: 'Toronto\'s Lake Ontario water supply carries moderate mineral hardness (95-110 mg/L TDS) that contributes to scale buildup',
    neighbourhoods: 'the Annex, Leslieville, East York, Roncesvalles, King West, Parkdale, and the Danforth',
    homeAge: '1890s-era Victorian homes alongside 2020s condos',
    brands: 'Samsung, LG, Whirlpool, Bosch, GE, and premium brands like Wolf and Miele in Forest Hill and Rosedale',
    region: 'City of Toronto'
  },
  'mississauga': {
    name: 'Mississauga',
    housing: 'large suburban detached homes, townhouse complexes in Erin Mills and Meadowvale, and high-rise condominiums along the Square One corridor',
    character: 'a multicultural suburban city with large households and modern housing developments west of Toronto',
    demographics: 'a multicultural community with large families, many South Asian and Middle Eastern households that rely heavily on daily home cooking',
    waterNote: 'Mississauga draws from the Lorne Park and Lakeview water treatment plants, producing moderately hard water that can affect appliance components over time',
    neighbourhoods: 'Erin Mills, Meadowvale, Streetsville, Port Credit, Cooksville, and City Centre',
    homeAge: '1970s-1990s suburban developments with newer infill construction',
    brands: 'Samsung, LG, Whirlpool, Frigidaire, and Bosch in newer developments',
    region: 'City of Mississauga and Peel Region'
  },
  'brampton': {
    name: 'Brampton',
    housing: 'large detached homes with spacious kitchens, newer townhouse developments in Mount Pleasant and Heritage Heights, and multi-generational family residences',
    character: 'a rapidly growing city in Peel Region known for large, multi-generational South Asian households',
    demographics: 'a large South Asian community with multi-generational households where daily cooking is central to family life, driving high-frequency appliance usage',
    waterNote: 'Brampton\'s water supply from the Region of Peel has moderate hardness levels that contribute to mineral deposits in appliance components',
    neighbourhoods: 'Mount Pleasant, Springdale, Heart Lake, Bramalea, Castlemore, and Gore Road',
    homeAge: '1980s-2000s suburban homes with newer developments in the north',
    brands: 'Samsung, LG, Whirlpool, and GE in builder-grade installations',
    region: 'City of Brampton and Peel Region'
  },
  'scarborough': {
    name: 'Scarborough',
    housing: '1960s-1990s detached bungalows and split-levels, post-war apartment towers, and newer townhouse complexes in Rouge and Highland Creek',
    character: 'a diverse district in Toronto\'s east end with a wide range of housing stock spanning four decades',
    demographics: 'one of Canada\'s most ethnically diverse communities, with South Asian, Chinese, Filipino, and Caribbean families across distinct neighbourhood clusters',
    waterNote: 'Scarborough receives treated Lake Ontario water through the R.C. Harris and R.L. Clark treatment plants with moderate mineral content',
    neighbourhoods: 'Agincourt, Malvern, Scarborough Village, Birch Cliff, Wexford, Guildwood, and Highland Creek',
    homeAge: '1960s-1990s housing stock with some newer infill developments',
    brands: 'Samsung, LG, Whirlpool, GE, and Frigidaire — often builder-grade units from the original construction era',
    region: 'Scarborough district of Toronto'
  },
  'north-york': {
    name: 'North York',
    housing: 'high-rise condominiums along Yonge Street, 1950s-1970s detached homes in Willowdale and Bayview Village, and newer townhouses in Newtonbrook',
    character: 'a major urban district in northern Toronto with a strong Korean community in Willowdale and affluent homes in Bayview Village',
    demographics: 'a large Korean community in the Willowdale corridor, alongside Iranian, Chinese, and long-established Jewish communities in the Bathurst corridor',
    waterNote: 'North York receives Toronto\'s treated Lake Ontario water supply, with the same moderate hardness that affects appliance longevity across the city',
    neighbourhoods: 'Willowdale, Bayview Village, Don Mills, Newtonbrook, Lansing, York Mills, and Downsview',
    homeAge: '1950s-1970s residential construction alongside modern condo towers',
    brands: 'Samsung and LG dominate in Willowdale and condo buildings, with Bosch and Miele in Bayview Village and York Mills luxury homes',
    region: 'North York district of Toronto'
  },
  'etobicoke': {
    name: 'Etobicoke',
    housing: '1950s lakefront bungalows along the Lakeshore, post-war detached homes in Islington and Kingsway, and modern condominiums in Humber Bay',
    character: 'a western Toronto district combining established lakefront neighbourhoods with growing condo developments along the waterfront',
    demographics: 'a mix of long-time homeowners in established neighbourhoods and new condo residents along the Humber Bay waterfront corridor',
    waterNote: 'Etobicoke receives treated water from the R.C. Harris plant, with the same moderate hardness levels as the rest of Toronto',
    neighbourhoods: 'Mimico, New Toronto, Long Branch, Islington, the Kingsway, Humber Bay, and Rexdale',
    homeAge: '1940s-1960s bungalows and wartime housing alongside 2010s condo towers',
    brands: 'Whirlpool, GE, and Frigidaire in older homes; Samsung and LG in newer condos and renovated kitchens',
    region: 'Etobicoke district of Toronto'
  },
  'vaughan': {
    name: 'Vaughan',
    housing: 'upscale detached homes in Woodbridge and Kleinburg, modern townhouses in Vellore Village, and new high-rise developments near the Vaughan Metropolitan Centre',
    character: 'an affluent city north of Toronto with a strong Italian-Canadian community known for premium kitchen builds and high-end appliances',
    demographics: 'a significant Italian-Canadian community in Woodbridge that values premium kitchen design, alongside growing communities in Vellore and the VMC corridor',
    waterNote: 'Vaughan\'s water supply from York Region has moderate to slightly hard mineral content that can affect appliance components over their service life',
    neighbourhoods: 'Woodbridge, Kleinburg, Maple, Thornhill (west), Vellore Village, and the Vaughan Metropolitan Centre',
    homeAge: '1980s-2000s custom homes in Woodbridge, with newer developments in Vellore and the VMC',
    brands: 'Bosch, KitchenAid, and Wolf in Woodbridge custom kitchens; Samsung and LG in newer builder-grade homes',
    region: 'City of Vaughan and York Region'
  },
  'markham': {
    name: 'Markham',
    housing: 'modern detached homes in Cornell and Angus Glen, established townhouses in Unionville, and tech-corridor condominiums near Highway 7',
    character: 'a thriving tech hub northeast of Toronto with a large Chinese community and modern housing developments',
    demographics: 'a large Chinese and South Asian community in one of Canada\'s most diverse municipalities, with many tech-industry professionals and young families',
    waterNote: 'Markham receives York Region water with moderate hardness that can contribute to mineral scale in appliance components',
    neighbourhoods: 'Unionville, Markham Village, Cornell, Angus Glen, Milliken, and Cathedraltown',
    homeAge: '1990s-2010s housing stock with heritage homes in Unionville village',
    brands: 'Samsung, LG, and Panasonic popular in the Asian community; Bosch and KitchenAid in Angus Glen luxury homes',
    region: 'City of Markham and York Region'
  },
  'richmond-hill': {
    name: 'Richmond Hill',
    housing: 'affluent suburban detached homes in South Richvale and Bayview Hill, established family homes in Oak Ridges, and newer developments along Yonge Street',
    character: 'an affluent suburban community north of Toronto with tree-lined streets and well-maintained family homes',
    demographics: 'an affluent mix of Chinese, Iranian, and European-descent families in one of York Region\'s most established residential communities',
    waterNote: 'Richmond Hill receives York Region water supply with moderate mineral hardness typical of the GTA\'s Lake Ontario-sourced system',
    neighbourhoods: 'South Richvale, Bayview Hill, Oak Ridges, Mill Pond, Jefferson, and Westbrook',
    homeAge: '1980s-2000s construction with newer infill in established areas',
    brands: 'Bosch, KitchenAid, and Sub-Zero in premium homes; Samsung and LG in standard residential installations',
    region: 'Town of Richmond Hill and York Region'
  },
  'oakville': {
    name: 'Oakville',
    housing: 'upscale lakefront estates in Bronte and Old Oakville, established family homes in Glen Abbey, and newer developments in North Oakville',
    character: 'an affluent lakefront community west of Toronto known for premium homes and high-end kitchen installations',
    demographics: 'an affluent community with many executive families, retirees in lakefront estates, and young families in North Oakville developments',
    waterNote: 'Oakville\'s water from Halton Region has moderate hardness levels that can affect long-term appliance performance',
    neighbourhoods: 'Old Oakville, Bronte, Glen Abbey, River Oaks, Clearview, and Joshua Creek',
    homeAge: '1970s estates in Old Oakville alongside 2010s construction in North Oakville',
    brands: 'Wolf, Sub-Zero, Miele, and Viking in lakefront estates; Samsung, LG, and Bosch in standard residential homes',
    region: 'Town of Oakville and Halton Region'
  },
  'burlington': {
    name: 'Burlington',
    housing: 'established family homes near the lakefront, 1970s-1990s detached homes in Alton Village and Millcroft, and newer developments in North Burlington',
    character: 'a family-oriented lakeside city at the western edge of the GTA with a mix of established and newer residential areas',
    demographics: 'a family-oriented community with a mix of long-time homeowners near the lake and young families in newer northern developments',
    waterNote: 'Burlington\'s Halton Region water supply has moderate hardness that contributes to gradual mineral scale in appliance components',
    neighbourhoods: 'Downtown Burlington, Alton Village, Millcroft, Tyandaga, Palmer, and North Burlington',
    homeAge: '1960s-1990s homes near the lake, with 2000s-2020s construction in the north',
    brands: 'Whirlpool, GE, and KitchenAid in established homes; Samsung and LG in newer installations',
    region: 'City of Burlington and Halton Region'
  },
  'ajax': {
    name: 'Ajax',
    housing: '1990s-2010s detached homes and townhouses in South Ajax, newer developments in North Ajax, and established family homes near the waterfront',
    character: 'a Durham Region commuter community east of Toronto with modern residential developments and good access to Highway 401',
    demographics: 'a diverse community of young families and commuters with one of Durham Region\'s fastest-growing residential areas',
    waterNote: 'Ajax receives Durham Region water supply sourced from Lake Ontario, with moderate mineral content',
    neighbourhoods: 'South Ajax, North Ajax, Pickering Village, Westney Heights, and Audley',
    homeAge: '1990s-2010s suburban construction with some newer infill',
    brands: 'Samsung, LG, Whirlpool, and Frigidaire in builder-grade installations typical of GTA suburban development',
    region: 'Town of Ajax and Durham Region'
  },
  'pickering': {
    name: 'Pickering',
    housing: '1970s-2000s detached homes in the Amberlea and Rougemount neighbourhoods, newer developments in Seaton, and townhouse clusters near the GO station',
    character: 'a Durham Region community combining established residential neighbourhoods with new development in Seaton and the city centre',
    demographics: 'a mix of established families and new homeowners, with growing Caribbean, South Asian, and East African communities',
    waterNote: 'Pickering receives Durham Region\'s treated Lake Ontario water with moderate mineral hardness',
    neighbourhoods: 'Amberlea, Rougemount, Bay Ridges, Liverpool, Dunbarton, and the Seaton development area',
    homeAge: '1970s-2000s suburban homes with major new construction in Seaton',
    brands: 'Whirlpool, GE, Samsung, and LG across the various eras of residential construction',
    region: 'City of Pickering and Durham Region'
  },
  'oshawa': {
    name: 'Oshawa',
    housing: '1950s-1970s detached homes in central Oshawa, newer developments in Windfields and Northwood, and student housing near Ontario Tech University',
    character: 'Durham Region\'s largest city, historically an automotive manufacturing centre now diversifying with university growth and new residential development',
    demographics: 'a working-class community with strong roots in automotive manufacturing, alongside a growing student population and new families in northern developments',
    waterNote: 'Oshawa\'s Durham Region water supply from Lake Ontario has moderate mineral content that can affect appliance longevity',
    neighbourhoods: 'Central Oshawa, Taunton, Windfields, Northwood, Samac, and the Simcoe Street corridor',
    homeAge: '1950s-1970s working-class homes with newer construction in Windfields and the north end',
    brands: 'Whirlpool, GE, Frigidaire, and Kenmore in older homes; Samsung and LG in newer developments',
    region: 'City of Oshawa and Durham Region'
  },
  'whitby': {
    name: 'Whitby',
    housing: '1980s-2000s family homes in Brooklin and Williamsburg, newer developments along Taunton Road, and established residential areas in downtown Whitby',
    character: 'a Durham Region community known as a family-friendly residential area with strong schools and growing commercial development',
    demographics: 'predominantly young families and commuters who value the combination of suburban living and GO Transit access to downtown Toronto',
    waterNote: 'Whitby receives Durham Region water from Lake Ontario with moderate mineral hardness levels',
    neighbourhoods: 'Brooklin, Williamsburg, Blue Grass Meadows, Pringle Creek, and downtown Whitby',
    homeAge: '1980s-2000s suburban construction with ongoing new development in Brooklin',
    brands: 'Samsung, LG, Whirlpool, and Maytag in standard residential installations',
    region: 'Town of Whitby and Durham Region'
  },
  'near-me': {
    name: 'the Greater Toronto Area',
    housing: 'everything from downtown Toronto condos to suburban detached homes across the GTA',
    character: 'the Greater Toronto Area encompassing the City of Toronto and surrounding municipalities',
    demographics: 'millions of diverse residents across the GTA, from downtown condo dwellers to suburban families in surrounding municipalities',
    waterNote: 'GTA water sourced from Lake Ontario has moderate mineral hardness that affects appliance longevity across the region',
    neighbourhoods: 'Toronto, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington, and Durham Region',
    homeAge: 'housing stock spanning from 1890s Victorian homes to brand-new 2026 construction',
    brands: 'Samsung, LG, Whirlpool, GE, Bosch, Frigidaire, Kenmore, Maytag, KitchenAid, Wolf, Miele, and Viking',
    region: 'Greater Toronto Area'
  }
};

// Appliance-specific content generators
const applianceContent = {
  'oven': {
    getSection1: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>How We Diagnose Oven Problems in ${c.name}</h2>
    <p>When you call Appliance Repair Near Me for oven repair in ${c.name}, our licensed technicians follow a systematic diagnostic process refined over thousands of GTA service calls. Accurate diagnosis on the first visit prevents unnecessary part replacements and keeps your repair cost predictable. Here is our standard oven diagnostic procedure for ${c.name} homes:</p>
    <ol style="margin:0 0 16px 24px;line-height:1.9">
      <li><strong>Visual and safety inspection</strong> — We check the power supply, gas line condition (if applicable), and oven door seal integrity before powering the unit on. In ${c.name} homes with ${c.housing}, wiring age and gas connector condition vary widely and must be assessed first.</li>
      <li><strong>Error code retrieval</strong> — For electronic ovens (Samsung, LG, Bosch, Whirlpool), we pull stored fault codes from the control board. These codes point directly to the failing component — igniter circuit, temperature sensor, door lock motor, or relay board — and eliminate guesswork.</li>
      <li><strong>Component-level testing</strong> — We use a multimeter to test the bake element, broil element, temperature sensor (thermistor), thermal fuse, and igniter (gas models) for continuity and correct resistance values. Each component has a manufacturer-specified resistance range that confirms whether it is within tolerance or failing.</li>
      <li><strong>Temperature calibration check</strong> — We place a calibrated oven thermometer inside the cavity and run a 350°F bake cycle for 15 minutes. If the actual temperature deviates more than 25°F from the set point, the temperature sensor or control board calibration needs correction.</li>
      <li><strong>Gas pressure verification (gas ovens only)</strong> — For gas oven repairs across ${c.name}, our Ontario-licensed gas technicians verify the supply pressure at the oven manifold using a manometer. Incorrect pressure causes weak flame output, delayed ignition, or complete igniter failure over time.</li>
      <li><strong>Written diagnosis and quote</strong> — We present findings and a firm repair quote before any work begins. No surprises, no pressure — you approve the repair or you pay only the diagnostic fee.</li>
    </ol>`;
    },
    getSection2: (city) => {
      const c = cityData[city];
      const citySpecific = city === 'toronto' ? 'Victorian semis in the Annex and Leslieville often have gas ovens installed during kitchen renovations with original-era gas lines. Downtown condos almost exclusively use electric ranges with glass-ceramic cooktops where control board failures are the leading issue.'
        : city === 'mississauga' ? 'Large suburban homes in Erin Mills and Meadowvale often have double-oven configurations that see heavy daily use. Gas ranges in Streetsville older homes may have aging flex connectors that require inspection during service calls.'
        : city === 'brampton' ? 'Multi-generational households in Brampton use ovens significantly more frequently than the GTA average, with many families cooking multiple large meals daily. This increased usage accelerates wear on bake elements, igniters, and door gaskets compared to lighter-use households.'
        : city === 'scarborough' ? 'The 1960s-1990s housing stock in Agincourt and Malvern means many homes still have original-era wiring that may not support newer high-draw electric ovens without circuit upgrades. Gas ovens in Scarborough Village and Birch Cliff require igniter service more frequently due to the age of installation.'
        : city === 'north-york' ? 'The Korean community in Willowdale frequently uses Samsung and LG ranges with features specific to Asian cooking needs. High-rise condos along Yonge Street have compact electric ovens where control board failures dominate the call volume.'
        : city === 'etobicoke' ? 'Lakefront bungalows in Mimico and Long Branch from the 1940s-1960s era often have electric ovens on older 240V circuits that may need upgrading. Newer Humber Bay condos feature compact Samsung and Bosch ovens with electronic controls prone to power-surge damage.'
        : city === 'vaughan' ? 'Custom kitchens in Woodbridge frequently feature Wolf, KitchenAid, and Bosch professional-grade ovens that require brand-specific diagnostic tools and OEM parts. The Italian-Canadian community in Vaughan expects precise oven performance for traditional baking and cooking.'
        : city === 'markham' ? 'The tech-savvy community in Markham often has smart-enabled Samsung and LG ovens with Wi-Fi connectivity features. Cornell and Angus Glen homes feature premium kitchen builds with Bosch and KitchenAid double ovens that require specialized service.'
        : city === 'richmond-hill' ? 'Affluent homes in Bayview Hill and South Richvale feature premium ovens from Bosch, KitchenAid, and Wolf. Standard family homes in Oak Ridges and Mill Pond typically have Samsung or LG ranges where control board and element failures are the most common calls.'
        : city === 'oakville' ? 'Lakefront estates in Old Oakville and Bronte feature Wolf, Viking, and Miele professional ovens that require specialized service knowledge. Glen Abbey and River Oaks homes typically have KitchenAid and Bosch built-in ovens where temperature calibration issues are common.'
        : city === 'burlington' ? 'Established homes near the Burlington lakefront often have older GE and Whirlpool ovens approaching the end of their service life. Northern Burlington developments have newer Samsung and LG ranges where electronic control issues are the primary repair call.'
        : city === 'ajax' || city === 'pickering' ? `${c.name} homes built in the 1990s-2010s typically feature builder-grade Samsung, LG, and Whirlpool ovens. As these units reach the 10-15 year mark, bake element burnout and control board failures become the dominant repair calls in the area.`
        : city === 'oshawa' ? 'Central Oshawa homes from the 1950s-1970s often have older GE and Frigidaire ovens on aging electrical circuits. Windfields and Northwood developments have newer Samsung and LG ranges where electronic failures are the leading service call.'
        : city === 'whitby' ? 'Brooklin and Williamsburg homes built in the 1990s-2000s typically have Samsung, LG, and Whirlpool ovens now reaching the age where element and control board failures begin occurring. Downtown Whitby heritage homes may have gas ovens on older supply lines.'
        : `Homes across ${c.name} feature a range of oven types from gas to electric, convection to standard, and compact condo models to full-size residential units. Each configuration has distinct failure patterns that our technicians are trained to identify and repair.`;
      return `<h2 ${H2_STYLE}>Common Oven Issues in ${c.name} Homes</h2>
    <p>The type and frequency of oven problems we see in ${c.name} reflect the local housing stock — ${c.housing}. ${citySpecific}</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Bake element burnout</strong> — The most common electric oven failure. The element develops a visible break or scorch mark and the oven heats only from the broil element above. Replacement takes 30-45 minutes.</li>
      <li><strong>Gas igniter failure</strong> — The igniter glows but does not reach the temperature needed to open the gas valve, or it does not glow at all. This is the leading gas oven repair across ${c.name}. Ontario-licensed gas technicians are required for this repair.</li>
      <li><strong>Control board malfunction</strong> — Samsung, LG, and Bosch electronic ovens display error codes or become completely unresponsive. Power surges during summer storms are a common trigger in ${c.name}.</li>
      <li><strong>Temperature sensor failure</strong> — The oven overshoots or undershoots the set temperature by 50°F or more. The thermistor sensor has drifted out of specification and needs replacement.</li>
      <li><strong>Door hinge or gasket failure</strong> — The oven door sags, does not close flush, or the gasket is cracked. Heat escapes during cooking and the oven cannot maintain temperature. Self-cleaning cycles in ${c.name} homes accelerate gasket deterioration.</li>
      <li><strong>Convection fan motor seizure</strong> — The fan motor bearings wear out after 5-10 years of regular use, causing the fan to stop or produce a grinding noise. Common in newer Samsung and Bosch convection ovens installed in ${c.name} homes.</li>
    </ul>`;
    },
    getSection3: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Oven Repair Cost Guide for ${c.name}</h2>
    <p>Oven repair costs in ${c.name} depend on the specific component that has failed, the brand and model of your oven, and whether the unit is gas or electric. Appliance Repair Near Me charges an $89 diagnostic fee that is waived when you proceed with the repair. Here are the typical repair costs for ${c.name} homeowners:</p>
    <p><strong>Electric oven bake or broil element replacement:</strong> $100-$200 including parts and labour. This is the most common and most affordable oven repair. <strong>Gas oven igniter replacement:</strong> $100-$200 — requires an Ontario-licensed gas technician. <strong>Temperature sensor (thermistor) replacement:</strong> $90-$170. <strong>Control board replacement:</strong> $180-$380 depending on brand — Samsung and LG boards are typically $180-$280, while Wolf and Miele boards run $280-$450. <strong>Door hinge or gasket replacement:</strong> $95-$185. <strong>Convection fan motor replacement:</strong> $150-$280.</p>
    <p>All oven repairs in ${c.name} include a 90-day parts and labour warranty. We provide the exact repair cost in writing before beginning any work — no hidden fees, no surprises. For ${c.name} homeowners, our transparent pricing means you can make an informed decision about repair versus replacement before any money changes hands.</p>`;
    },
    getSection4: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Warning Signs — Call Appliance Repair Near Me Immediately</h2>
    <p>Some oven problems in ${c.name} require immediate professional attention. Do not attempt to diagnose or repair these issues yourself — contact Appliance Repair Near Me at <a href="${PHONE_LINK}" style="color:#1976D2;font-weight:600;">${PHONE}</a> right away if you notice any of the following:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Gas smell with the oven off</strong> — This is a potential gas leak. Do not flip any electrical switches. Leave the home immediately with the door open and call your gas provider first, then call us for oven diagnosis once the line is cleared.</li>
      <li><strong>Sparking or arcing inside the oven cavity</strong> — A damaged bake or broil element can arc against the oven wall, creating a fire risk. Turn off the oven at the breaker immediately.</li>
      <li><strong>Burning smell that is not food residue</strong> — Melting wire insulation or a failing control board can produce a distinct electrical burning odour. Power off the oven at the breaker and call for service.</li>
      <li><strong>Oven door locked and will not release after self-clean</strong> — The thermal lock mechanism has failed. Do not force the door — this can break the latch mechanism and damage the door hinge assembly.</li>
      <li><strong>Visible scorch marks on the oven element</strong> — A scorched element is about to fail completely and may arc. Replace it before the next use.</li>
    </ul>`;
    },
    getSection5: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Why ${c.name} Homeowners Choose Appliance Repair Near Me</h2>
    <p>${c.name} residents have options for oven repair, but homeowners across ${c.neighbourhoods} consistently choose Appliance Repair Near Me for these reasons:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Same-day service with local dispatch</strong> — We position technicians across ${c.region}, so your oven repair call reaches someone already in your area. Typical arrival time is 2-4 hours when you call before 2 PM.</li>
      <li><strong>Gas and electric oven expertise</strong> — Our technicians are licensed for both gas and electric appliance repair in Ontario. Gas oven work requires a licensed gas technician by provincial regulation — every tech on our team meets this requirement.</li>
      <li><strong>All major brands serviced</strong> — From ${c.brands}, we carry diagnostic tools and common replacement parts for every brand found in ${c.name} homes.</li>
      <li><strong>Transparent, written pricing</strong> — We quote the repair cost in writing before any work begins. The $89 diagnostic fee is waived when you proceed with the repair. No hidden trip charges, no inflated parts markups.</li>
      <li><strong>90-day warranty on all repairs</strong> — Every oven repair in ${c.name} includes a 90-day parts and labour warranty. If the same issue returns within 90 days, we fix it at no additional cost.</li>
    </ul>`;
    },
    getSection6: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Maintenance Tips for Oven Owners in ${c.name}</h2>
    <p>Regular maintenance extends the life of your oven and reduces the likelihood of emergency repair calls. Here are five practical tips for ${c.name} homeowners based on the conditions and housing stock in your area:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Inspect the door gasket every six months</strong> — Press a piece of paper between the door and the oven frame, close the door, and pull. If the paper slides out easily, the gasket is not sealing properly and should be replaced. This is especially important in ${c.name} homes where self-cleaning cycles are used regularly.</li>
      <li><strong>Clean the oven interior without abrasives</strong> — Use a baking soda and water paste instead of commercial oven cleaners with harsh chemicals. Abrasive cleaners can damage the oven cavity coating and expose bare metal to corrosion. ${c.waterNote}, and mineral residue from steam cleaning can leave deposits that affect element performance.</li>
      <li><strong>Test the oven temperature annually</strong> — Place a standalone oven thermometer in the centre of the cavity and run a 350°F bake cycle for 20 minutes. If the reading is off by more than 25°F, the temperature sensor may be drifting and should be checked.</li>
      <li><strong>Run the self-clean cycle no more than twice per year</strong> — The extreme heat of a self-clean cycle (800-900°F) stresses the thermal fuse, door lock motor, and gasket. In ${c.name} homes where ovens see heavy use, limiting self-clean frequency prevents premature component failure.</li>
      <li><strong>Protect against power surges</strong> — Install a surge protector on the oven circuit or a whole-home surge protector at the breaker panel. Summer thunderstorms in ${c.name} cause voltage spikes that damage electronic control boards in Samsung, LG, and Bosch ovens.</li>
    </ul>`;
    }
  },
  'stove': {
    getSection1: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>How We Diagnose Stove Problems in ${c.name}</h2>
    <p>Stove repair in ${c.name} requires precise diagnosis because stovetops combine gas burner systems, electric heating elements, and electronic controls — sometimes all in the same dual-fuel unit. When you call Appliance Repair Near Me at <a href="${PHONE_LINK}" style="color:#1976D2;font-weight:600;">${PHONE}</a>, our licensed technicians follow a structured diagnostic protocol developed for the specific housing stock and appliance brands found across ${c.name}:</p>
    <ol style="margin:0 0 16px 24px;line-height:1.9">
      <li><strong>Safety inspection first</strong> — For gas stoves, we check the flex connector condition, shutoff valve operation, and burner cap seating before testing ignition. For electric models in ${c.name} homes with ${c.homeAge}, we verify the 240V circuit and outlet condition. Ontario regulation requires a licensed gas technician for all gas appliance diagnostics.</li>
      <li><strong>Burner-by-burner testing</strong> — Each burner is tested individually. Gas burners are checked for ignition delay, flame colour (blue vs. orange-tinged), flame shape, and simmer stability. Electric elements and glass-top zones are tested for heat output, cycling accuracy, and response time.</li>
      <li><strong>Control system diagnostics</strong> — For electronic stoves, we retrieve stored error codes from the control board. For manual-control gas stoves, we test each infinite switch, spark module, and thermostat for correct resistance values and switching continuity.</li>
      <li><strong>Gas pressure measurement</strong> — On gas stoves, we measure the manifold pressure with a manometer to confirm it matches the manufacturer specification. Low pressure causes weak flame and slow heating; high pressure causes yellowing flame and soot deposits.</li>
      <li><strong>Glass cooktop surface inspection</strong> — For Samsung, LG, and Bosch glass-top stoves common in ${c.name}, we inspect for hairline cracks, delamination, and hotspot discolouration that indicate failing elements beneath the surface.</li>
      <li><strong>Detailed written quote</strong> — We present our diagnosis and a firm repair cost before touching any parts. You decide whether to proceed — no pressure, no hidden fees.</li>
    </ol>`;
    },
    getSection2: (city) => {
      const c = cityData[city];
      const citySpecific = city === 'toronto' ? 'Gas stoves are prevalent in Annex, Junction, and Roncesvalles rowhouses where kitchen renovations added gas lines. Downtown condos almost exclusively use electric glass-top ranges where control board failures and cracked cooktop surfaces are the primary calls.'
        : city === 'mississauga' ? 'Large households in Mississauga use stoves more intensively than the GTA average, with multi-course meal preparation placing extra demands on burner components. Gas ranges in Streetsville older homes require more frequent igniter and burner cap service.'
        : city === 'brampton' ? 'Multi-generational Brampton households cook on their stoves far more frequently than typical GTA use patterns, often running multiple burners simultaneously for extended periods. This heavy usage drives higher rates of burner igniter wear, infinite switch failure, and gas valve fatigue.'
        : city === 'scarborough' ? 'The diverse 1960s-1990s housing stock means stove types vary widely from street to street. Older homes in Wexford and Scarborough Village may have original-era gas lines with aging connectors, while newer Agincourt townhouses typically have Samsung or LG electric glass-top models.'
        : city === 'north-york' ? 'The Korean community in Willowdale frequently uses Samsung and LG gas ranges with high-BTU power burners for wok cooking. Yonge Street condos have compact electric stoves where glass-top cracking from thermal shock is a common call.'
        : city === 'etobicoke' ? 'Older bungalows in Mimico and Long Branch often have coil-element electric stoves on aging 240V circuits. Humber Bay condos feature compact Samsung and Bosch glass-top ranges where control board issues from power surges are the leading repair call.'
        : city === 'vaughan' ? 'Custom kitchens in Woodbridge frequently feature Wolf, Bosch, and KitchenAid professional gas ranges with high-BTU burners and precision simmer capability. These premium stoves require brand-specific diagnostic tools and OEM replacement parts.'
        : city === 'markham' ? 'High-BTU gas burners for wok cooking are popular in Markham homes, placing additional stress on gas valve assemblies and igniter components. Cornell and Angus Glen premium kitchens often feature dual-fuel ranges that combine gas burners with electric oven sections.'
        : city === 'richmond-hill' ? 'Bayview Hill and South Richvale premium kitchens often feature Bosch, KitchenAid, or Wolf gas ranges. Standard family homes in Oak Ridges typically have Samsung or LG glass-top electric stoves where element and control board failures are the most common calls.'
        : city === 'oakville' || city === 'burlington' ? `Premium homes in ${c.name} frequently feature Wolf, Viking, and Thermador professional gas ranges with multiple high-BTU burners. Standard residential areas have Samsung, LG, and Whirlpool stoves where glass-top cracking and igniter failure are the most common repairs.`
        : `${c.name} homes feature a mix of gas and electric stoves reflecting ${c.homeAge}. Builder-grade Samsung, LG, and Whirlpool models are most common in newer developments, while older homes may have GE, Frigidaire, or Kenmore units that have provided years of reliable service.`;
      return `<h2 ${H2_STYLE}>Common Stove Issues in ${c.name} Homes</h2>
    <p>The stove problems we encounter in ${c.name} reflect the local housing character — ${c.housing}. ${citySpecific}</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Gas burner igniter failure</strong> — The igniter clicks continuously without producing a flame, or produces no click at all. This is the single most common gas stove repair we perform across ${c.name}. The igniter or spark module has failed and requires replacement by a licensed gas technician.</li>
      <li><strong>Glass cooktop cracking</strong> — Thermal shock from placing cold cookware on a hot surface, or impact damage, can crack the glass-ceramic cooktop. Replacement is a same-visit repair when we have the correct panel in stock for your Samsung, LG, or Bosch model.</li>
      <li><strong>Uneven burner flame</strong> — One side of the flame ring burns higher than the other, or the flame lifts away from the burner. This typically indicates a clogged burner port or misaligned burner cap — a cleaning and realignment fix rather than a part replacement.</li>
      <li><strong>Electric element not heating</strong> — A coil element or radiant element under a glass top fails to heat. The element, its receptacle, or the infinite switch controlling it has failed. Testing with a multimeter identifies which component needs replacement.</li>
      <li><strong>Control knob or infinite switch failure</strong> — The stove control does not click into position, or a burner stays on high regardless of the knob position. The infinite switch or control valve behind the knob needs replacement.</li>
      <li><strong>Error codes on electronic stoves</strong> — Samsung, LG, and Bosch glass-top stoves display error codes when a temperature sensor, relay, or control module fails. We read all manufacturer fault codes and identify the exact component for replacement.</li>
    </ul>`;
    },
    getSection3: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Stove Repair Cost Guide for ${c.name}</h2>
    <p>Stove repair costs in ${c.name} depend on whether your stove is gas or electric, the brand and model, and the specific component that has failed. Appliance Repair Near Me charges an $89 diagnostic fee that is waived when you proceed with the repair. Here are the typical stove repair costs for ${c.name} residents:</p>
    <p><strong>Gas burner igniter replacement:</strong> $80-$180 per burner — the most common gas stove repair. <strong>Gas valve assembly replacement:</strong> $150-$280. <strong>Glass cooktop panel replacement:</strong> $200-$450 depending on brand and size — Samsung and LG panels are $200-$350, while Bosch and KitchenAid panels run $300-$450. <strong>Electric coil element replacement:</strong> $70-$140. <strong>Radiant element under glass top:</strong> $120-$220. <strong>Infinite switch replacement:</strong> $80-$150. <strong>Control board replacement:</strong> $180-$380.</p>
    <p>Ontario regulation requires gas stove repairs to be performed by a licensed gas technician. All our technicians carry the required Ontario gas licence. Every stove repair in ${c.name} includes a 90-day parts and labour warranty with the exact cost confirmed in writing before work begins.</p>`;
    },
    getSection4: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Warning Signs — Call Appliance Repair Near Me Immediately</h2>
    <p>Certain stove problems in ${c.name} homes require immediate professional attention. Gas stoves in particular carry safety considerations that should never be handled as DIY projects. Contact Appliance Repair Near Me at <a href="${PHONE_LINK}" style="color:#1976D2;font-weight:600;">${PHONE}</a> immediately if you notice:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Gas smell when all burners are off</strong> — This indicates a potential gas leak at the stove connection, internal valve, or supply line. Do not operate any electrical switches. Ventilate by opening windows, leave the home, and call your gas utility provider immediately. Once the supply is cleared, call us for stove diagnosis.</li>
      <li><strong>Yellow or orange flame instead of blue</strong> — A gas burner should produce a steady blue flame with a small yellow tip. A fully yellow or orange flame indicates incomplete combustion from clogged burner ports, incorrect gas pressure, or a damaged burner assembly — conditions that produce carbon monoxide.</li>
      <li><strong>Sparking or arcing from an electric element</strong> — If a coil element or glass-top surface produces visible sparks, turn off the stove at the breaker immediately. The element has a break that is arcing against the drip pan or cooktop surface.</li>
      <li><strong>Glass cooktop crack with visible element beneath</strong> — A cracked glass surface exposes the radiant element and creates a shock hazard. Do not use the affected burner zone until the panel is replaced.</li>
      <li><strong>Persistent clicking after all burners are turned off</strong> — The spark ignition module is firing continuously, which can indicate a wiring short or moisture in the spark module. This drains the module and can be a fire hazard.</li>
      <li><strong>Burning plastic smell from behind the control panel</strong> — A failing wiring connection or relay is overheating. Power off the stove at the breaker and do not use it until inspected.</li>
    </ul>`;
    },
    getSection5: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Why ${c.name} Homeowners Choose Appliance Repair Near Me</h2>
    <p>Residents across ${c.neighbourhoods} choose Appliance Repair Near Me for stove repair because we combine local presence with professional capability that matches the diverse range of stoves found in ${c.name} homes:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Ontario-licensed gas technicians</strong> — Every technician on our ${c.name} team carries the provincial gas licence required for gas stove diagnostics and repair. We never subcontract gas work to unlicensed personnel.</li>
      <li><strong>Same-day arrival across ${c.region}</strong> — We dispatch from local positions across the area, with typical arrival in 2-4 hours when you call before 2 PM. Evening and Saturday appointments are held for residents who cannot be home during business hours.</li>
      <li><strong>All brands, all fuel types</strong> — Gas, electric, induction, and dual-fuel stoves from ${c.brands} — we service every configuration found in ${c.name} homes and carry the most common parts on every truck.</li>
      <li><strong>First-visit completion rate</strong> — We stock the most common stove parts for the brands prevalent in ${c.name}. Igniter modules, infinite switches, control boards, and glass-top panels for Samsung, LG, and Bosch are carried on every dispatch to the area.</li>
      <li><strong>90-day warranty with written pricing</strong> — Every stove repair includes a 90-day parts and labour warranty. The repair cost is confirmed in writing before work begins — no hidden charges, no after-the-fact markups.</li>
    </ul>`;
    },
    getSection6: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Maintenance Tips for Stove Owners in ${c.name}</h2>
    <p>Proper stove maintenance reduces emergency repair calls and extends the useful life of your appliance. Here are five maintenance tips tailored to stove ownership in ${c.name}:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Clean burner caps and ports monthly</strong> — Remove gas burner caps and clean the ignition ports with a pin or thin wire. Food debris and grease clog these ports over time, causing uneven flame and ignition delay. In ${c.name} households with frequent cooking, monthly cleaning prevents most igniter-related service calls.</li>
      <li><strong>Lift and clean beneath the cooktop</strong> — Most gas stoves have a hinged top that lifts for access to the burner area. Grease and food particles accumulate here and can reach wiring connections. Cleaning this area quarterly prevents grease-related electrical issues.</li>
      <li><strong>Use flat-bottomed cookware on glass tops</strong> — Warped or round-bottomed pots on a glass cooktop cause uneven heat distribution, hotspots, and potential surface cracking. This is especially important in ${c.name} homes where glass-top Samsung and LG stoves are common.</li>
      <li><strong>Check gas flex connector annually</strong> — The flexible gas connector between the wall shutoff and the stove should be inspected for kinks, corrosion, or cracking annually. ${c.waterNote}, and humidity in kitchen environments accelerates connector degradation. Connectors older than 10 years should be replaced as a preventive measure.</li>
      <li><strong>Avoid using aluminium foil on the cooktop</strong> — Aluminium foil on gas burner drip pans or electric coil drip bowls restricts airflow and can cause element overheating. On glass-top stoves, foil can melt onto the ceramic surface and cause permanent damage that requires panel replacement.</li>
    </ul>`;
    }
  },
  'washer': {
    getSection1: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>How We Diagnose Washer Problems in ${c.name}</h2>
    <p>Washer repair in ${c.name} starts with accurate diagnosis. A washing machine that leaks, won't spin, or displays an error code can have multiple potential causes, and misdiagnosis leads to unnecessary part replacement and wasted money. When you call Appliance Repair Near Me at <a href="${PHONE_LINK}" style="color:#1976D2;font-weight:600;">${PHONE}</a>, our technicians follow this systematic diagnostic process for ${c.name} homes:</p>
    <ol style="margin:0 0 16px 24px;line-height:1.9">
      <li><strong>Installation and plumbing check</strong> — Before touching the washer itself, we verify the water supply valve operation, drain hose routing, standpipe height, and levelling. In ${c.name} homes with ${c.housing}, plumbing configurations vary significantly and installation issues frequently mimic washer malfunctions.</li>
      <li><strong>Error code retrieval</strong> — For Samsung, LG, Whirlpool, and Bosch washers, we pull stored fault codes from the control module. Codes like UE (unbalanced load), OE (drain failure), and DE (door lock) point directly to the failing system and prevent unnecessary disassembly.</li>
      <li><strong>Mechanical inspection</strong> — We check the drum for play (indicating worn bearings), spin the drum by hand to listen for grinding, and inspect the door boot gasket for tears, mould, or mineral deposits. Front-loader drum bearings and top-loader tub bearings are tested with specific load-bearing procedures.</li>
      <li><strong>Water system testing</strong> — We test the water inlet valves for correct flow rate, check the drain pump for blockages, and verify the pressure switch (water level sensor) is reading correctly. Restricted inlet flow or a weak drain pump are common causes of incomplete cycles.</li>
      <li><strong>Electrical component testing</strong> — The motor, motor capacitor, door lock assembly, lid switch (top-loaders), and control board relays are tested with a multimeter for correct resistance and continuity values.</li>
      <li><strong>Written diagnosis and firm quote</strong> — We explain the findings in plain language and provide a written repair cost before any work begins. You make the call — repair, replace, or pay only the diagnostic fee.</li>
    </ol>`;
    },
    getSection2: (city) => {
      const c = cityData[city];
      const citySpecific = city === 'toronto' ? 'Downtown condos along King West and the waterfront have compact Samsung and LG front-loaders installed in tight laundry closets where drum bearing failure and door gasket mould are the leading calls. Victorian semis in Parkdale and Roncesvalles often have basement laundry rooms with non-standard plumbing that complicates diagnosis.'
        : city === 'mississauga' ? 'Large families in Erin Mills and Meadowvale run their washers more frequently than the GTA average, driving higher rates of drum bearing wear, drain pump stress, and detergent buildup. Newer townhouse complexes often have stacked washer-dryer units in tight closets where water line access is limited.'
        : city === 'brampton' ? 'Multi-generational households in Brampton run their washing machines at significantly higher frequency than the GTA average, with some homes running 8-12 loads per day. This intensive usage accelerates drum bearing wear, drain pump fatigue, and water inlet valve weakening far sooner than the manufacturer-projected service life.'
        : city === 'scarborough' ? 'The 1960s-1990s housing stock in Agincourt, Malvern, and Wexford means many homes have older basement laundry configurations with 1.5-inch drain lines rather than the 2-inch standard required by modern front-loaders. This mismatch causes slow drainage and OE error codes that are installation issues, not washer malfunctions.'
        : city === 'north-york' ? 'Willowdale condos and apartments along Yonge Street have compact Samsung and LG front-loaders in tight in-suite laundry closets. Don Mills and Bayview Village detached homes typically have full-size washers in dedicated laundry rooms, with Bosch and Miele common in higher-end properties.'
        : city === 'etobicoke' ? 'Older bungalows in Mimico and Long Branch have basement laundry rooms from the 1950s-1960s era where standpipe heights and drain bore may not meet modern front-loader specifications. Humber Bay condos have compact Samsung units in stackable configurations where vibration and levelling issues are common.'
        : city === 'vaughan' ? 'Custom homes in Woodbridge frequently have dedicated laundry rooms with premium Bosch WAT and Miele W1 front-loaders. These brands require OEM-specification parts and brand-specific service procedures. Standard Maple and Vellore homes typically have Samsung or LG units where drum bearing and door gasket failures are the primary calls.'
        : city === 'markham' ? 'Modern homes in Cornell and Angus Glen feature full-size laundry rooms with Samsung and LG front-loaders. The tech-savvy Markham community often has smart-enabled washers with Wi-Fi diagnostics, but the mechanical failure patterns — drum bearings, gaskets, pumps — remain the same regardless of connectivity features.'
        : city === 'richmond-hill' ? 'Premium homes in Bayview Hill often have Bosch or Miele front-loaders in custom laundry rooms. Standard family homes in Oak Ridges and Jefferson typically have Samsung or LG units where door boot gasket deterioration from hard water mineral deposits is the most common service call.'
        : city === 'oakville' || city === 'burlington' ? `Premium ${c.name} homes feature Miele, Bosch, and Electrolux front-loaders in custom laundry rooms. Standard residential areas have Samsung, LG, and Whirlpool units where drum bearing wear, door gasket mould, and drain pump blockages are the dominant repair calls.`
        : `${c.name} homes feature a range of washer types reflecting the area's housing development history. Front-loaders from Samsung, LG, and Bosch are most common in newer installations, while older homes may still have top-loading Whirlpool, GE, or Maytag units that have provided reliable service for years.`;
      return `<h2 ${H2_STYLE}>Common Washer Issues in ${c.name} Homes</h2>
    <p>Washer problems in ${c.name} are shaped by the local housing stock — ${c.housing} — and the regional water quality. ${citySpecific}</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Drum bearing failure</strong> — A loud grinding or rumbling noise during the spin cycle indicates worn drum bearings. This is the most mechanically intensive washer repair but extends the machine's life by 5-8 years when completed correctly. Front-loaders are more prone than top-loaders.</li>
      <li><strong>Door boot gasket tears and mould</strong> — The rubber gasket around a front-loader door traps moisture, detergent residue, and mineral deposits. Over time, the gasket develops tears that leak water onto the floor, or mould growth that produces odour. ${c.waterNote} accelerates gasket deterioration.</li>
      <li><strong>Drain pump failure or blockage</strong> — The washer won't drain or displays an OE/F21 error code. The drain pump motor has failed, or a foreign object (coin, button, small sock) has lodged in the pump filter. Pump filter cleaning is a 15-minute fix; pump motor replacement takes about 45 minutes.</li>
      <li><strong>Water inlet valve failure</strong> — The washer fills slowly, does not fill with hot or cold water, or overfills. The inlet valve solenoid has failed or the screen filter is clogged with sediment. This is a common issue in ${c.name} homes with older plumbing.</li>
      <li><strong>Excessive vibration during spin cycle</strong> — Worn shock absorbers (front-loaders) or suspension springs (top-loaders) allow the drum to move excessively during high-speed spin. Uneven flooring in older ${c.name} homes also contributes to vibration issues.</li>
      <li><strong>Error codes and control board failure</strong> — Samsung, LG, and Whirlpool washers display error codes when sensors detect abnormal conditions. Some codes indicate simple fixes (rebalance the load); others indicate control board relay failure that requires board replacement.</li>
    </ul>`;
    },
    getSection3: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Washer Repair Cost Guide for ${c.name}</h2>
    <p>Washer repair costs in ${c.name} depend on whether your machine is a front-loader or top-loader, the brand and model, and the specific component that has failed. Appliance Repair Near Me charges an $89 diagnostic fee that is waived when you proceed with the repair. Here are the typical washer repair costs for ${c.name} homeowners:</p>
    <p><strong>Door boot gasket replacement (front-loader):</strong> $150-$250 — the most common front-loader repair call in ${c.name}. <strong>Drain pump replacement:</strong> $140-$240. <strong>Drum bearing replacement:</strong> $250-$400 depending on brand — Samsung and LG bearings run $250-$350, while Bosch and Miele OEM bearings run $300-$400. <strong>Water inlet valve replacement:</strong> $100-$180. <strong>Shock absorber or suspension spring replacement:</strong> $120-$200. <strong>Control board replacement:</strong> $180-$350. <strong>Lid switch replacement (top-loader):</strong> $80-$140.</p>
    <p>All washer repairs in ${c.name} include a 90-day parts and labour warranty. We provide the exact repair cost in writing before work begins. For front-loader drum bearing replacements — the most expensive common washer repair — we always discuss the repair-vs-replace calculation with the homeowner to ensure the investment makes financial sense given the machine's age and condition.</p>`;
    },
    getSection4: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Warning Signs — Call Appliance Repair Near Me Immediately</h2>
    <p>Some washer problems in ${c.name} require immediate attention to prevent water damage to your home. A leaking washer on an upper floor or in a condo unit can cause thousands of dollars in damage to floors, ceilings, and neighbouring units. Contact us at <a href="${PHONE_LINK}" style="color:#1976D2;font-weight:600;">${PHONE}</a> right away if you observe:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Water pooling under or around the washer</strong> — Turn off the water supply valves behind the machine immediately. The leak may be from a torn door gasket, failed pump seal, or cracked supply hose. In ${c.name} condo units, a washer leak can damage units below within minutes.</li>
      <li><strong>Burning smell during operation</strong> — A failing motor, seized drum bearing, or overheating belt produces a distinct burning odour. Stop the cycle and unplug the washer. Do not restart until inspected.</li>
      <li><strong>Loud banging or metallic grinding during spin</strong> — This indicates a failing drum bearing, broken shock absorber, or loose counterweight. Continuing to run the washer risks catastrophic bearing failure that damages the outer drum and makes the machine unrepairable.</li>
      <li><strong>Error code that repeats after reset</strong> — A persistent error code (especially UE, OE, DE, or F21) that reappears after a power reset indicates a hardware failure, not a temporary glitch. Professional diagnosis is needed to identify the failing component.</li>
      <li><strong>Visible mould or persistent odour from the drum</strong> — Mould inside the drum, on the door gasket, or in the detergent dispenser indicates a drainage, ventilation, or gasket issue that requires cleaning and potential gasket replacement. HE detergent overuse in ${c.name}'s water conditions accelerates mould growth in front-loaders.</li>
    </ul>`;
    },
    getSection5: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Why ${c.name} Homeowners Choose Appliance Repair Near Me</h2>
    <p>Homeowners across ${c.neighbourhoods} choose Appliance Repair Near Me for washer repair because we understand the specific conditions and housing configurations that affect washers in this area:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Same-day service with local dispatch</strong> — A broken washer in a ${c.name} household creates an immediate disruption, especially for families with children. We dispatch from local positions across ${c.region} with typical arrival in 2-4 hours when you call before 2 PM.</li>
      <li><strong>Front-loader and top-loader expertise</strong> — We service both configurations across all brands: Samsung, LG, Whirlpool, Bosch, Miele, GE, Frigidaire, and Maytag. From compact condo units to full-size residential machines, our technicians carry the common parts for every configuration found in ${c.name}.</li>
      <li><strong>Plumbing-aware diagnostics</strong> — We check installation factors — standpipe height, drain hose routing, supply valve condition, and levelling — before diagnosing the washer itself. In ${c.name} homes with ${c.homeAge}, plumbing factors often cause symptoms that mimic washer malfunctions.</li>
      <li><strong>Transparent pricing, no pressure</strong> — The $89 diagnostic fee is waived when you proceed with the repair. We provide a written quote before starting any work, and we discuss the repair-vs-replace calculation honestly when the machine's age makes replacement a reasonable option.</li>
      <li><strong>90-day parts and labour warranty</strong> — Every washer repair in ${c.name} is backed by a 90-day warranty. If the same issue returns within the warranty period, we come back at no additional charge.</li>
    </ul>`;
    },
    getSection6: (city) => {
      const c = cityData[city];
      return `<h2 ${H2_STYLE}>Maintenance Tips for Washer Owners in ${c.name}</h2>
    <p>Regular maintenance significantly extends washer life and prevents the most common repair calls we see in ${c.name}. Here are five practical tips based on the water quality and housing conditions in your area:</p>
    <ul style="margin:0 0 16px 20px;line-height:1.9">
      <li><strong>Run a drum-clean cycle monthly</strong> — Use a washer cleaning tablet or 250 ml of white vinegar on a hot empty cycle. ${c.waterNote}, and this monthly cycle dissolves mineral film from drum surfaces and the door gasket groove, preventing the scale buildup that accelerates bearing wear and gasket deterioration in ${c.name} homes.</li>
      <li><strong>Use the correct amount of HE detergent</strong> — High-efficiency front-loaders require significantly less detergent than the cap measurement suggests. Excess detergent creates a residue film inside the drum, door gasket, and drain system that traps moisture and promotes mould growth. Use half the manufacturer-recommended amount as a starting point.</li>
      <li><strong>Leave the door open between loads</strong> — After the final load, leave the front-loader door ajar (or fully open if space permits) to allow the drum and gasket to dry. This single habit prevents the vast majority of mould and odour issues that we see in ${c.name} front-loader service calls.</li>
      <li><strong>Clean the drain pump filter quarterly</strong> — Most front-loaders have an access panel on the lower front where the drain pump filter can be removed and cleaned. Coins, buttons, hair ties, and lint accumulate here and restrict drainage. Cleaning this filter quarterly prevents OE drain error codes.</li>
      <li><strong>Inspect supply hoses annually</strong> — Rubber supply hoses degrade over time and are the leading cause of catastrophic washer flooding. Check for bulging, cracking, or corrosion at the connectors annually. Replace rubber hoses with braided stainless steel hoses every 5 years as preventive maintenance — this is especially important in ${c.name} homes where a washer leak on an upper floor can cause significant damage.</li>
    </ul>`;
    }
  }
};

// Also handle washer-dryer-repair-near-me as washer with "near-me" city
function getExtendedContent(appliance, city) {
  const app = applianceContent[appliance];
  if (!app) return null;

  const content = `
<section class="extended-content" aria-label="Detailed service information" style="padding:40px 0;background:#F8FAFF;">
  <div style="max-width:920px;margin:0 auto;padding:0 24px;font-size:15px;line-height:1.8;color:#334155;">
    ${app.getSection1(city)}
    ${app.getSection2(city)}
    ${app.getSection3(city)}
    ${app.getSection4(city)}
    ${app.getSection5(city)}
    ${app.getSection6(city)}
  </div>
</section>

`;
  return content;
}

// Process files
const files = [
  // Oven files
  'oven-repair-toronto.html', 'oven-repair-mississauga.html', 'oven-repair-brampton.html',
  'oven-repair-scarborough.html', 'oven-repair-north-york.html', 'oven-repair-etobicoke.html',
  'oven-repair-vaughan.html', 'oven-repair-markham.html', 'oven-repair-richmond-hill.html',
  'oven-repair-oakville.html', 'oven-repair-burlington.html', 'oven-repair-ajax.html',
  'oven-repair-pickering.html', 'oven-repair-oshawa.html', 'oven-repair-whitby.html',
  'oven-repair-near-me.html',
  // Stove files
  'stove-repair-toronto.html', 'stove-repair-mississauga.html', 'stove-repair-brampton.html',
  'stove-repair-scarborough.html', 'stove-repair-north-york.html', 'stove-repair-etobicoke.html',
  'stove-repair-vaughan.html', 'stove-repair-markham.html', 'stove-repair-richmond-hill.html',
  'stove-repair-oakville.html', 'stove-repair-burlington.html', 'stove-repair-ajax.html',
  'stove-repair-pickering.html', 'stove-repair-oshawa.html', 'stove-repair-whitby.html',
  'stove-repair-near-me.html',
  // Washer files
  'washer-repair-toronto.html', 'washer-repair-mississauga.html', 'washer-repair-brampton.html',
  'washer-repair-scarborough.html', 'washer-repair-north-york.html', 'washer-repair-etobicoke.html',
  'washer-repair-vaughan.html', 'washer-repair-markham.html', 'washer-repair-richmond-hill.html',
  'washer-repair-oakville.html', 'washer-repair-burlington.html', 'washer-repair-ajax.html',
  'washer-repair-pickering.html', 'washer-repair-oshawa.html', 'washer-repair-whitby.html',
  'washer-repair-near-me.html', 'washer-dryer-repair-near-me.html'
];

let processed = 0;
let skipped = 0;
let alreadyHas = 0;

for (const file of files) {
  const filePath = path.join(DIR, file);

  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${file}`);
    skipped++;
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Check if already has extended content
  if (html.includes('class="extended-content"')) {
    console.log(`SKIP (already has extended content): ${file}`);
    alreadyHas++;
    continue;
  }

  // Parse appliance and city from filename
  const match = file.match(/^(oven|stove|washer(?:-dryer)?)-repair-(.+)\.html$/);
  if (!match) {
    console.log(`SKIP (no match): ${file}`);
    skipped++;
    continue;
  }

  const appliance = match[1].includes('dryer') ? 'washer' : match[1];
  const city = match[2];

  if (!cityData[city]) {
    console.log(`SKIP (no city data for ${city}): ${file}`);
    skipped++;
    continue;
  }

  const extendedContent = getExtendedContent(appliance, city);
  if (!extendedContent) {
    console.log(`SKIP (no content generated): ${file}`);
    skipped++;
    continue;
  }

  // Insert before <section class="faq-section"
  const faqMarker = '<section class="faq-section"';
  const faqIndex = html.indexOf(faqMarker);

  if (faqIndex === -1) {
    console.log(`SKIP (no faq-section found): ${file}`);
    skipped++;
    continue;
  }

  html = html.slice(0, faqIndex) + extendedContent + html.slice(faqIndex);

  fs.writeFileSync(filePath, html, 'utf8');
  processed++;
  console.log(`OK: ${file} (${appliance} + ${city})`);
}

console.log(`\n=== BATCH 2 RESULTS ===`);
console.log(`Processed: ${processed}`);
console.log(`Already had content: ${alreadyHas}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total: ${processed + alreadyHas + skipped}`);
