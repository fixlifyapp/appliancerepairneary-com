#!/usr/bin/env node
/**
 * inject-extended-content.js
 * Generates ~1,500 words of unique extended content per page
 * and injects it BEFORE <section class="faq-section"
 */

const fs = require('fs');
const path = require('path');

const PHONE = '(437) 524-1053';
const PHONE_LINK = '<a href="tel:+14375241053">(437) 524-1053</a>';
const H2_STYLE = 'style="font-size:clamp(18px,2.5vw,26px);color:#1E3A5F;margin:32px 0 12px;font-weight:700;"';

// City context data
const cityData = {
  'toronto': {
    display: 'Toronto',
    housing: 'Victorian row homes in the Annex, modern condos along the waterfront, post-war bungalows in East York, and Edwardian semis in Riverdale',
    context: 'Toronto is the GTA\'s most densely populated city, with over 2.9 million residents across diverse neighbourhoods from the Danforth to High Park. The city\'s housing stock spans more than a century of construction, and appliance usage patterns vary significantly between downtown condo dwellers and suburban homeowners.',
    water: 'Lake Ontario-sourced water with 120-145 mg/L calcium hardness — moderately hard water that accelerates scale buildup',
    climate: 'Toronto\'s humid continental climate means extreme seasonal swings: summer humidity pushes appliances harder, while winter heating dries indoor air and can affect rubber seals and gaskets',
    neighbourhoods: 'the Annex, Leslieville, East York, Roncesvalles, Liberty Village, and the Junction',
    homeowners: 'busy downtown professionals, growing families in midtown, and multi-generational households across the city',
    brands: 'Samsung and LG in newer condos, Bosch and Miele in upscale homes, Whirlpool and GE in older detached houses'
  },
  'mississauga': {
    display: 'Mississauga',
    housing: 'spacious suburban detached homes in Erin Mills, townhouse communities in Meadowvale, high-rise condos in Square One, and family homes in Streetsville',
    context: 'Mississauga is Canada\'s sixth-largest city with over 720,000 residents. The city features large suburban homes that tend to have full-sized, heavy-duty appliances. Many households are multicultural families who rely heavily on their kitchen appliances for daily meal preparation.',
    water: 'Peel Region water sourced from Lake Ontario with moderate hardness levels around 115-130 mg/L — enough to cause gradual mineral buildup in appliances',
    climate: 'Mississauga shares the Lake Ontario microclimate with humid summers and cold winters — basement laundry areas can develop condensation issues that affect dryer venting and washer drainage',
    neighbourhoods: 'Erin Mills, Meadowvale, Streetsville, Port Credit, Lakeview, and Cooksville',
    homeowners: 'suburban families with multiple children, professional couples in newer condos, and multi-generational households who use appliances intensively',
    brands: 'Whirlpool and LG in newer subdivisions, Samsung in condo developments, Bosch in premium homes, and Maytag in established neighbourhoods'
  },
  'brampton': {
    display: 'Brampton',
    housing: 'newer detached homes in Mount Pleasant, established subdivisions in Heart Lake, townhouses in Springdale, and multi-generational family homes throughout the city',
    context: 'Brampton is one of Canada\'s fastest-growing cities with over 650,000 residents. The city\'s large, multi-generational households mean appliances work harder and longer each day. Many Brampton homes have two refrigerators and run their dishwashers and laundry machines daily or more.',
    water: 'Peel Region water with moderate hardness (115-130 mg/L) that can cause mineral deposits in dishwasher spray arms, washing machine inlet valves, and refrigerator water line connections',
    climate: 'Brampton sits slightly inland from Lake Ontario, experiencing colder winters and hotter summers than lakefront communities — this temperature range stresses appliance compressors and heating elements',
    neighbourhoods: 'Mount Pleasant, Heart Lake, Springdale, Castlemore, Bramalea, and Gore Meadows',
    homeowners: 'growing multi-generational families, new homeowners in recently built subdivisions, and busy parents who depend on reliable appliances for large households',
    brands: 'Samsung and LG are dominant in newer Brampton builds, Whirlpool in established homes, and GE and Frigidaire in older Bramalea-area properties'
  },
  'scarborough': {
    display: 'Scarborough',
    housing: '1960s split-level homes in Agincourt, 1970s-era bungalows in Scarborough Village, modern townhouses in Rouge Park, and high-rise apartments along the Scarborough Town Centre corridor',
    context: 'Scarborough is a vast and diverse district in Toronto\'s east end, home to over 630,000 residents from Caribbean, South Asian, East Asian, and Filipino communities. The housing stock ranges from 1960s-era builds to modern infill developments, each with distinct appliance configurations and challenges.',
    water: 'Toronto\'s municipal water supply with moderate-to-hard calcium levels — older Scarborough homes with original copper plumbing may have additional sediment that affects appliance inlet valves',
    climate: 'Scarborough\'s proximity to the Scarborough Bluffs creates localized lake-effect humidity that can accelerate corrosion on appliance components, particularly in homes near the bluffs',
    neighbourhoods: 'Agincourt, Scarborough Village, Woburn, Malvern, Rouge, and Birch Cliff',
    homeowners: 'diverse families in established neighbourhoods, first-time homebuyers in townhouse developments, and renters in high-rise buildings who need fast, reliable appliance service',
    brands: 'older Whirlpool and GE units in 1970s homes, Samsung and LG in newer builds and high-rises, and Frigidaire and Kenmore in mid-century properties'
  },
  'north-york': {
    display: 'North York',
    housing: 'high-rise condos along Yonge Street, detached family homes in Willowdale, luxury properties in York Mills, and post-war bungalows in Don Mills',
    context: 'North York stretches from the 401 corridor to Steeles Avenue, encompassing some of Toronto\'s most diverse communities. Willowdale\'s large Korean community favours specific appliance brands, while York Mills and Bayview Village feature premium European appliances in upscale kitchens.',
    water: 'Toronto municipal water supply — North York\'s mix of older and newer plumbing infrastructure means water pressure and sediment levels can vary between buildings and neighbourhoods',
    climate: 'North York\'s inland position means slightly more extreme temperatures than downtown Toronto — summer heat pushes refrigerator compressors harder, while winter cold affects garage-located appliances',
    neighbourhoods: 'Willowdale, Don Mills, York Mills, Bayview Village, Newtonbrook, and Lansing',
    homeowners: 'Korean families in Willowdale who prefer LG and Samsung, affluent homeowners in York Mills with Miele and Sub-Zero, and young professionals in Yonge corridor condos',
    brands: 'LG and Samsung are strongly preferred in Willowdale, Miele and Bosch in York Mills, and a mix of all major brands across Don Mills and Newtonbrook'
  },
  'etobicoke': {
    display: 'Etobicoke',
    housing: '1950s bungalows in New Toronto, lakefront properties in Mimico and Long Branch, modern condos near Humber Bay, and family homes in Rexdale and Islington',
    context: 'Etobicoke stretches along Toronto\'s western waterfront and inland to the 427 corridor. The neighbourhood mix ranges from charming 1950s-era lakefront bungalows to brand-new condo towers along the Gardiner Expressway. This variety means appliance technicians encounter everything from vintage GE units to the latest smart appliances.',
    water: 'Toronto\'s Lake Ontario water supply — lakefront Etobicoke homes experience higher ambient humidity that can accelerate gasket and seal degradation in appliances',
    climate: 'Etobicoke\'s lakefront position creates higher humidity levels than inland neighbourhoods, which can cause moisture-related issues in dryers, accelerate mold in washing machines, and stress refrigerator condenser coils',
    neighbourhoods: 'Mimico, Long Branch, New Toronto, Humber Bay, Islington, and Rexdale',
    homeowners: 'young families moving into new condos, long-term residents in established bungalow neighbourhoods, and investors with rental properties along the waterfront',
    brands: 'newer Samsung and LG units in Humber Bay condos, classic Whirlpool and GE in 1950s homes, and premium Bosch units in renovated lakefront properties'
  },
  'vaughan': {
    display: 'Vaughan',
    housing: 'upscale newer detached homes in Kleinburg, modern subdivisions in Vellore, established Italian-community homes in Woodbridge, and condo developments near Vaughan Metropolitan Centre',
    context: 'Vaughan is one of Ontario\'s fastest-growing municipalities, known for newer, larger homes and an affluent demographic. The city\'s Italian-Canadian community in Woodbridge has a strong tradition of premium kitchen design, meaning many Vaughan homes feature high-end European appliances.',
    water: 'York Region water sourced from Lake Ontario and local wells — some Vaughan areas have harder water than Toronto, requiring more frequent appliance descaling',
    climate: 'Vaughan\'s position north of Toronto means slightly colder winters and more snow — garage-located appliances face temperature extremes, and power fluctuations during winter storms can damage control boards',
    neighbourhoods: 'Woodbridge, Kleinburg, Maple, Thornhill (Vaughan side), Vellore, and Concord',
    homeowners: 'established Italian-Canadian families with premium kitchens, young professional families in new subdivisions, and affluent homeowners in Kleinburg estate properties',
    brands: 'Bosch, KitchenAid, and Miele in upscale Woodbridge and Kleinburg kitchens, Samsung and LG in newer Vellore and Maple builds, and Whirlpool in established homes'
  },
  'markham': {
    display: 'Markham',
    housing: '1990s suburban detached homes in Unionville, modern townhouses in Cornell, high-tech condos near Markham Centre, and established homes in Thornhill',
    context: 'Markham is a tech hub in York Region with a large, diverse population exceeding 330,000. The city\'s strong Asian-Canadian community influences appliance preferences — many homeowners favour brands with smart technology integration and compact, efficient designs suited to their cooking styles.',
    water: 'York Region water with varying hardness levels — Markham homes in areas served by well water may experience higher mineral content that affects appliance components',
    climate: 'Markham sits in the inland part of the GTA with more temperature extremes than lakefront communities — this is particularly relevant for refrigerators in garages and dryers in unheated laundry rooms',
    neighbourhoods: 'Unionville, Cornell, Markham Centre, Thornhill, Milliken, and Berczy',
    homeowners: 'tech-savvy Asian-Canadian families, young professionals in newer townhouse developments, and established families in 1990s-era homes across Unionville and Thornhill',
    brands: 'Samsung and LG are extremely popular across Markham, with Bosch growing in newer premium builds and Panasonic and Hitachi in some households'
  },
  'richmond-hill': {
    display: 'Richmond Hill',
    housing: 'affluent suburban detached homes in South Richvale, newer builds in Oak Ridges, established properties in Mill Pond, and townhouses in the Yonge corridor',
    context: 'Richmond Hill is an affluent York Region municipality with a diverse population of over 200,000. The city\'s homes tend to be newer and larger than Toronto\'s, with spacious kitchens that accommodate full-sized premium appliances. Many residents commute to Toronto and need appliance repairs scheduled outside traditional work hours.',
    water: 'York Region water supply — Richmond Hill homes in the Oak Ridges Moraine area may have well water with higher mineral content that causes faster scale buildup in appliances',
    climate: 'Richmond Hill\'s slightly elevated position on the Oak Ridges Moraine means more extreme winter temperatures — power outages during ice storms can cause refrigerator food spoilage and require post-outage appliance checks',
    neighbourhoods: 'South Richvale, Oak Ridges, Mill Pond, Bayview Hill, Westbrook, and Langstaff',
    homeowners: 'professional families who need evening and weekend appointment availability, affluent homeowners with premium appliance investments, and newer residents in recently built subdivisions',
    brands: 'Bosch and KitchenAid in premium kitchens, Samsung and LG in newer developments, and Whirlpool and Maytag in established homes'
  },
  'oakville': {
    display: 'Oakville',
    housing: 'upscale lakefront properties in Old Oakville, luxury detached homes in Joshua Creek, newer estates in north Oakville, and heritage homes in downtown Oakville',
    context: 'Oakville is one of the GTA\'s most affluent municipalities, with a housing stock that skews toward larger, premium properties. Homeowners here invest in high-end appliances and expect service quality to match. Many Oakville kitchens feature integrated, panel-ready appliances that require specialized knowledge.',
    water: 'Halton Region water from Lake Ontario — generally moderate hardness, but some older Oakville homes have galvanized plumbing that introduces additional sediment',
    climate: 'Oakville\'s lakefront position along Lake Ontario provides a moderating climate effect, but lake-effect humidity can cause condensation issues in poorly ventilated laundry areas and around refrigerator condenser coils',
    neighbourhoods: 'Old Oakville, Bronte, Joshua Creek, River Oaks, Glen Abbey, and Eastlake',
    homeowners: 'affluent families with premium appliance collections, executives who need flexible scheduling, and heritage home owners who require careful work in renovated kitchens',
    brands: 'Miele, Sub-Zero, and Wolf in luxury kitchens, Bosch and KitchenAid in upper-middle-market homes, and Samsung in newer north Oakville developments'
  },
  'burlington': {
    display: 'Burlington',
    housing: 'a mix of 1970s detached homes in Aldershot, newer family homes in Millcroft, waterfront properties in Lakeshore, and townhouse communities in Burlington East',
    context: 'Burlington is a family-oriented city of over 185,000 residents in Halton Region. The city blends established 1970s-era neighbourhoods with modern developments, creating a range of appliance repair scenarios from aging units in original kitchens to cutting-edge smart appliances in new builds.',
    water: 'Halton Region water supply from Lake Ontario — moderate hardness that should be monitored for scale buildup in high-use appliances',
    climate: 'Burlington\'s location at the western tip of Lake Ontario means moderate temperatures but significant lake-effect snow in winter — power reliability is generally good, but rural north Burlington can experience outages',
    neighbourhoods: 'Aldershot, Millcroft, Tyandaga, Lakeshore, Orchard, and Burlington East',
    homeowners: 'established families in older homes who need reliable repair service, young families in newer subdivisions, and downsizers in waterfront condos',
    brands: 'Whirlpool and GE in 1970s homes, Samsung and LG in newer builds, and Bosch in renovated kitchens'
  },
  'ajax': {
    display: 'Ajax',
    housing: 'a mix of 1980s subdivision homes in South Ajax, newer developments in north Ajax, townhouse communities near Highway 2, and lakefront properties along Lake Ontario',
    context: 'Ajax is a growing Durham Region municipality with about 120,000 residents. As a commuter community east of Toronto, Ajax residents need flexible appointment scheduling. The city\'s housing stock is relatively young, with most homes built from the 1980s onward.',
    water: 'Durham Region water from Lake Ontario — generally consistent quality with moderate hardness, though some Ajax homes near agricultural areas may have slightly different water characteristics',
    climate: 'Ajax benefits from Lake Ontario\'s moderating effect on temperature, but Durham Region receives heavier snowfall than central Toronto — winter storm power outages can affect appliance electronics',
    neighbourhoods: 'South Ajax, Central Ajax, North Ajax, Pickering Beach, and the Highway 2 corridor',
    homeowners: 'commuter families who need evening and weekend scheduling, young families in starter homes, and established residents in 1990s-era subdivisions',
    brands: 'Whirlpool, GE, and Frigidaire in older homes, Samsung and LG in newer developments, and Maytag across mid-range properties'
  },
  'pickering': {
    display: 'Pickering',
    housing: '1970s detached homes in the Bay Ridges area, newer subdivisions in Duffins Creek, townhouses along Kingston Road, and rural properties in north Pickering',
    context: 'Pickering bridges the gap between urban Toronto and the eastern GTA suburbs. With over 95,000 residents, the city offers a mix of established and new housing. Many Pickering homes were built in the 1970s-1990s and are now reaching the age where original appliances need replacement or significant repair.',
    water: 'Durham Region water supply — consistent Lake Ontario-sourced water with moderate hardness levels suitable for most appliances',
    climate: 'Pickering\'s position along Lake Ontario provides moderate temperatures, but the rural north of the city experiences more extreme conditions that can affect appliance operation in unheated spaces',
    neighbourhoods: 'Bay Ridges, Liverpool, Duffins Creek, Amberlea, Brock Ridge, and Rougemount',
    homeowners: 'established families in aging homes that need appliance upgrades, new homebuyers in Seaton and Duffins Creek developments, and commuters who need flexible scheduling',
    brands: 'Whirlpool and GE in 1970s-80s homes, Samsung and LG in newer builds, and Frigidaire and Kenmore in mid-era properties'
  },
  'oshawa': {
    display: 'Oshawa',
    housing: 'post-war detached homes in south Oshawa, 1970s-80s subdivisions in central Oshawa, newer developments in north Oshawa, and heritage properties near downtown',
    context: 'Oshawa is Durham Region\'s largest city with over 170,000 residents. Known as a working-class and university city (Ontario Tech and Durham College), Oshawa has a practical, value-conscious homeowner base. Many homes here carry dependable mid-range appliances that have been running for 15-25 years.',
    water: 'Durham Region water with moderate hardness — Oshawa\'s mix of Lake Ontario water and local sources means water quality can vary slightly across the city',
    climate: 'Oshawa sits at the eastern edge of the GTA\'s Lake Ontario shore, receiving more lake-effect weather than western communities — this includes heavier winter precipitation that can cause power fluctuations',
    neighbourhoods: 'south Oshawa, Taunton, Windfields, McLaughlin, Northwood, and Kedron',
    homeowners: 'working families who need affordable, reliable repair service, university-area landlords who need fast turnaround, and new homeowners in rapidly developing north Oshawa',
    brands: 'Whirlpool, GE, and Frigidaire dominate Oshawa\'s housing stock, with Samsung and LG growing in newer north Oshawa developments'
  },
  'whitby': {
    display: 'Whitby',
    housing: 'established detached homes in Brooklin, waterfront properties in Port Whitby, newer subdivisions in west Whitby, and townhouses near downtown',
    context: 'Whitby is a growing Durham Region municipality with about 140,000 residents. The town offers a blend of small-town character and suburban growth, with Brooklin\'s rural heritage homes sitting alongside modern subdivisions. Whitby homeowners value reliable service and reasonable pricing.',
    water: 'Durham Region water supply — Whitby\'s water comes primarily from Lake Ontario with consistent moderate hardness levels',
    climate: 'Whitby\'s east-of-Toronto position means slightly colder winters and more snow, particularly in the Brooklin area — homeowners should be aware of cold-weather impacts on garage and basement appliances',
    neighbourhoods: 'Brooklin, Port Whitby, Williamsburg, Blue Grass Meadows, Pringle Creek, and Lynde Creek',
    homeowners: 'growing families in new subdivisions, established residents in Brooklin-area homes, and commuters who need appointment flexibility',
    brands: 'Samsung and LG in newer builds, Whirlpool and Maytag in established homes, and GE and Frigidaire in older properties'
  },
  'near-me': {
    display: 'Toronto & GTA',
    housing: 'downtown condos, suburban detached homes, townhouse communities, and heritage properties across the Greater Toronto Area',
    context: 'The Greater Toronto Area is home to over 6.5 million people across dozens of municipalities. Whether you live in a downtown Toronto condo or a suburban home in Durham Region, appliance breakdowns demand fast, local service. Appliance Repair Near Me dispatches technicians from multiple GTA locations to minimize travel time.',
    water: 'GTA water is primarily sourced from Lake Ontario with moderate hardness levels (100-145 mg/L) — enough to cause gradual mineral buildup in appliances over time',
    climate: 'The GTA\'s humid continental climate creates distinct seasonal demands on appliances: summer humidity strains cooling systems, while winter cold affects heating elements and can cause issues in unheated laundry spaces',
    neighbourhoods: 'every neighbourhood across the Greater Toronto Area, from Oakville to Oshawa and from Lake Ontario to the Oak Ridges Moraine',
    homeowners: 'homeowners, renters, and property managers across the GTA who need fast, reliable appliance repair from a trusted local provider',
    brands: 'all major brands including Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Maytag, KitchenAid, Kenmore, and Miele'
  }
};

// Appliance-specific data
const applianceData = {
  'dishwasher': {
    display: 'Dishwasher',
    diagnostic: {
      steps: [
        'We begin with a visual inspection of the dishwasher interior, door gasket, spray arms, and filter assembly — looking for visible damage, debris, or wear that indicates the failure mode before running any tests.',
        'Next, we run a diagnostic cycle while monitoring water inlet pressure, drain pump operation, heating element temperature, and control board signals using professional-grade multimeter and leak detection equipment.',
        'We pull stored error codes from the control board memory and cross-reference them against manufacturer service bulletins for your specific model — this reveals intermittent faults the machine may not currently display.',
        'Finally, we test individual components — the door latch switch, float switch, inlet valve solenoid, wash motor capacitor, and thermistor — to isolate the exact failed part before quoting the repair.'
      ]
    },
    issues: [
      'Drain pump blockage from food debris, broken glass fragments, or deteriorated impeller blades — causing standing water, foul odour, and incomplete wash cycles',
      'Inlet valve failure preventing the machine from filling with water, triggering fill-timeout error codes, or causing slow fill that extends cycle times beyond two hours',
      'Spray arm cracking, clogging from hard water mineral deposits, or bearing wear that reduces water pressure and leaves dishes dirty after a full cycle',
      'Control board relay failure causing the machine to stop mid-cycle, refuse to start, or display error codes that cannot be cleared with a standard reset',
      'Door latch and gasket deterioration leading to water leaks onto the kitchen floor, poor seal during wash cycles, and potential secondary water damage to cabinetry and flooring'
    ],
    costs: {
      diagnostic: '$89 diagnostic fee (credited in full toward any repair)',
      minor: 'Door latch, gasket, or float switch replacement: $110–$185',
      standard: 'Drain pump, inlet valve, or spray arm assembly: $150–$260',
      major: 'Control board, wash motor, or full heating element: $240–$380',
      parts: 'We stock OEM and OEM-equivalent parts for Samsung, LG, Bosch, Whirlpool, GE, and KitchenAid dishwashers — most repairs completed same-visit without parts ordering delays'
    },
    warnings: [
      'Water pooling under or around the dishwasher — even a small leak can damage subfloor and cabinetry within days',
      'Burning smell or visible scorch marks on the control panel — indicates potential electrical fault requiring immediate attention',
      'Dishwasher running continuously without completing a cycle — a stuck relay or failed control board can overheat components',
      'Error code that returns immediately after clearing — points to a hardware failure that will not resolve on its own',
      'Dishes coming out with a gritty residue or chemical smell — may indicate detergent dispenser malfunction or water inlet contamination',
      'Circuit breaker tripping when the dishwasher runs — signals a ground fault or short circuit that presents a safety hazard'
    ],
    maintenance: [
      'Clean the dishwasher filter assembly every two weeks — remove the lower rack, twist out the filter, rinse under running water, and use a soft brush to clear trapped food particles that reduce cleaning performance',
      'Run a monthly cleaning cycle using a dishwasher-safe cleaner or a cup of white vinegar placed upright on the top rack — this dissolves grease and mineral buildup inside the spray arms and pump housing',
      'Inspect the door gasket quarterly for cracks, black mold spots, or food debris — wipe with a damp cloth and mild detergent, and check that the gasket seals evenly when the door closes',
      'Check the spray arm nozzles for mineral blockage by removing the arms and holding them up to light — use a toothpick to clear any clogged holes, particularly important in areas with hard water',
      'Ensure the dishwasher is level by checking with a spirit level on the door sill — an unlevel machine causes water to pool unevenly, stresses door hinges, and can trigger leak sensor alarms'
    ]
  },
  'dryer': {
    display: 'Dryer',
    diagnostic: {
      steps: [
        'We start with a full external inspection — checking the dryer vent hose for kinks or disconnection, testing the wall outlet voltage with a multimeter, and examining the lint trap housing for blockage that restricts airflow.',
        'Next, we run the dryer through a timed heat cycle while measuring exhaust temperature, drum rotation speed, and power draw — comparing readings against manufacturer specifications to identify underperformance.',
        'We retrieve any stored diagnostic codes from the control board and cross-reference with manufacturer service bulletins — this catches intermittent thermal fuse trips, motor overloads, or sensor drift that may not trigger a visible error.',
        'Finally, we test individual components — the heating element continuity, thermal fuse, cycling thermostat, drum belt tension, idler pulley bearing, and door switch — to pinpoint the exact failure before providing a repair quote.'
      ]
    },
    issues: [
      'Heating element failure — the dryer runs but produces no heat, leaving clothes damp after a full cycle and forcing multiple re-runs that waste electricity',
      'Blocked or restricted dryer vent duct — lint accumulation reduces airflow, causes overheating, extends drying times, and creates a serious fire hazard that affects household safety',
      'Worn drum belt snapping or slipping — the motor runs but the drum does not rotate, or the dryer makes a loud thumping noise as the belt catches and releases',
      'Faulty thermal fuse or cycling thermostat — causes the dryer to shut off mid-cycle, refuse to start, or run without heat as a safety response to detected overheating',
      'Control board malfunction — displays incorrect error codes, fails to respond to button presses, or causes the dryer to stop at random points during the drying cycle'
    ],
    costs: {
      diagnostic: '$89 diagnostic fee (credited in full toward any repair)',
      minor: 'Thermal fuse, belt, or door switch replacement: $100–$170',
      standard: 'Heating element, idler pulley, or drum roller: $160–$275',
      major: 'Control board, drive motor, or gas valve assembly: $250–$400',
      parts: 'We carry common dryer parts for Samsung, LG, Whirlpool, Maytag, GE, and Frigidaire — most repairs completed on the first visit without waiting for parts'
    },
    warnings: [
      'Burning smell while the dryer is running — could indicate lint ignition, overheating element, or belt friction that requires immediate attention',
      'Clothes taking two or more cycles to dry — this is the most common sign of a blocked vent duct or failing heating element',
      'The dryer exterior is extremely hot to the touch — indicates restricted airflow or thermostat failure creating a fire risk',
      'Loud banging, squealing, or grinding noises — worn drum rollers, a fraying belt, or a failing motor bearing that will worsen rapidly',
      'The dryer starts then stops within a few minutes — a tripping thermal fuse or overheating motor that needs professional diagnosis',
      'Visible lint accumulation around the dryer vent exit outside your home — signals a duct blockage that needs clearing'
    ],
    maintenance: [
      'Clean the lint trap before every single load — a clogged lint screen is the number one cause of extended drying times, wasted energy, and dryer fires across Canada',
      'Have the dryer vent duct professionally cleaned at least once per year — lint buildup inside the duct restricts airflow, causes overheating, and is responsible for hundreds of residential fires annually',
      'Inspect the flexible vent hose behind the dryer every six months — check for kinks, crushing, or disconnection that reduces airflow and creates a lint trap',
      'Wipe the moisture sensor bars inside the drum with rubbing alcohol quarterly — fabric softener residue coats these sensors and causes the dryer to misjudge dryness levels',
      'Avoid overloading the dryer — an overstuffed drum prevents proper tumbling and air circulation, extending dry times and stressing the motor, belt, and drum rollers'
    ]
  },
  'fridge': {
    display: 'Refrigerator',
    diagnostic: {
      steps: [
        'We begin by measuring the internal temperature of both the refrigerator and freezer compartments using calibrated thermometers — checking for hot spots, uneven cooling, and temperature variance that indicates a specific system problem.',
        'Next, we inspect the condenser coils for dust and debris accumulation, test the evaporator fan and condenser fan motor operation, and listen for compressor cycling patterns that reveal performance degradation.',
        'We access the control board diagnostic mode to pull stored error codes and run system tests — this reveals defrost heater failures, damper motor issues, and sensor faults that may not be obvious during normal operation.',
        'Finally, we test individual components — the start relay and overload protector, defrost thermostat, temperature sensors, door gasket seal integrity, and water inlet valve — to identify the exact component requiring repair or replacement.'
      ]
    },
    issues: [
      'Compressor failure or degradation — the refrigerator runs constantly but fails to reach proper temperature, or the compressor clicks on and off repeatedly without cooling',
      'Defrost system malfunction — ice builds up on the evaporator coils, blocking airflow and causing the freezer to freeze solid while the refrigerator section warms up',
      'Evaporator or condenser fan motor failure — the compressor runs but air does not circulate properly, creating warm spots, frost patterns, and temperature inconsistency',
      'Door gasket deterioration — worn, cracked, or deformed seals allow warm air to enter continuously, forcing the compressor to overwork and increasing energy consumption by 20-30%',
      'Control board or thermostat failure — causes erratic temperature swings, prevents the compressor from cycling correctly, or displays error codes that indicate electronic component failure'
    ],
    costs: {
      diagnostic: '$89 diagnostic fee (credited in full toward any repair)',
      minor: 'Door gasket, light switch, or thermostat replacement: $100–$190',
      standard: 'Fan motor, defrost heater, or start relay: $155–$280',
      major: 'Compressor, sealed system repair, or control board: $280–$550',
      parts: 'We stock OEM and OEM-equivalent parts for Samsung, LG, Whirlpool, GE, Frigidaire, and KitchenAid refrigerators — critical repairs are completed same-day to prevent food spoilage'
    },
    warnings: [
      'Refrigerator not cooling but the light is on — indicates a compressor, fan, or sealed system issue that needs same-day attention to prevent food spoilage',
      'Unusual clicking, buzzing, or humming from the back of the fridge — often a failing start relay or compressor that will stop working completely within days',
      'Water pooling under or inside the refrigerator — could indicate a blocked defrost drain, cracked water line, or failed inlet valve',
      'Ice forming on the back wall of the refrigerator compartment — a defrost system failure that will progressively worsen and eventually block all airflow',
      'The refrigerator running constantly without cycling off — signals a refrigerant leak, dirty condenser coils, or thermostat failure driving up energy costs',
      'A strong odour despite cleaning — may indicate a blocked drain pan, failed fan motor allowing stagnant air, or a sealed system refrigerant leak'
    ],
    maintenance: [
      'Clean the condenser coils every six months — pull the fridge away from the wall or remove the bottom grille, and vacuum or brush away dust and pet hair that forces the compressor to work harder and shortens its life',
      'Check the door gasket seal monthly by closing the door on a piece of paper — if the paper slides out easily, the gasket is not sealing properly and should be cleaned or replaced to maintain efficiency',
      'Keep the refrigerator temperature at 3-4°C and the freezer at -18°C — temperatures outside this range waste energy, compromise food safety, or cause frost buildup that stresses the defrost system',
      'Clear the area around the refrigerator for proper ventilation — maintain at least 2 inches of clearance on each side and behind the unit to allow heat dissipation from the condenser coils',
      'Clean the drain pan and defrost drain twice a year — remove the drain pan (usually accessible from the bottom front), wash it with mild soap, and flush the defrost drain with warm water to prevent clogs and odour'
    ]
  }
};

function generateExtendedContent(appliance, city) {
  const app = applianceData[appliance];
  const loc = cityData[city];

  if (!app || !loc) return null;

  const appDisplay = app.display;
  const cityDisplay = loc.display;

  let html = `
<section class="extended-content" aria-label="Detailed service information" style="padding:40px 0;background:#F8FAFF;">
  <div style="max-width:920px;margin:0 auto;padding:0 24px;font-size:15px;line-height:1.8;color:#334155;">

    <h2 ${H2_STYLE}>How We Diagnose ${appDisplay} Problems in ${cityDisplay}</h2>
    <p>When you call Appliance Repair Near Me for ${appDisplay.toLowerCase()} repair in ${cityDisplay}, our technician arrives with professional diagnostic equipment and a systematic four-step process developed over thousands of service calls across ${loc.neighbourhoods}. ${loc.context.split('.')[0]}. Here is how our diagnostic works:</p>
    <ol style="margin:12px 0 16px 20px;">
      <li style="margin-bottom:8px;">${app.diagnostic.steps[0]}</li>
      <li style="margin-bottom:8px;">${app.diagnostic.steps[1]}</li>
      <li style="margin-bottom:8px;">${app.diagnostic.steps[2]}</li>
      <li style="margin-bottom:8px;">${app.diagnostic.steps[3]}</li>
    </ol>
    <p>${cityDisplay} homes include ${loc.housing}. Our technicians are familiar with the specific installation configurations common in these properties, which means faster, more accurate diagnosis on every call.</p>

    <h2 ${H2_STYLE}>Common ${appDisplay} Issues in ${cityDisplay} Homes</h2>
    <p>${loc.context} ${cityDisplay} homeowners commonly report these ${appDisplay.toLowerCase()} failure modes — all of which our technicians resolve on-site during the first visit:</p>
    <ul style="margin:12px 0 16px 20px;">
      <li style="margin-bottom:8px;"><strong>${app.issues[0].split(' — ')[0]}</strong> — ${app.issues[0].split(' — ')[1]}</li>
      <li style="margin-bottom:8px;"><strong>${app.issues[1].split(' — ')[0]}</strong> — ${app.issues[1].split(' — ')[1] || app.issues[1]}</li>
      <li style="margin-bottom:8px;"><strong>${app.issues[2].split(' — ')[0]}</strong> — ${app.issues[2].split(' — ')[1]}</li>
      <li style="margin-bottom:8px;"><strong>${app.issues[3].split(' — ')[0]}</strong> — ${app.issues[3].split(' — ')[1]}</li>
      <li style="margin-bottom:8px;"><strong>${app.issues[4].split(' — ')[0]}</strong> — ${app.issues[4].split(' — ')[1]}</li>
    </ul>
    <p>${loc.water}. This environmental factor directly affects ${appDisplay.toLowerCase()} longevity in ${cityDisplay}, making regular maintenance and prompt repair especially important for homeowners here. Popular brands in ${cityDisplay} include ${loc.brands}.</p>

    <h2 ${H2_STYLE}>${appDisplay} Repair Cost Guide for ${cityDisplay}</h2>
    <p>Appliance Repair Near Me provides transparent, written quotes before any ${appDisplay.toLowerCase()} repair work begins in ${cityDisplay}. There are no hidden fees and no surprises. Here is our current pricing guide for ${cityDisplay} residents:</p>
    <ul style="margin:12px 0 16px 20px;list-style:none;">
      <li style="margin-bottom:8px;"><strong>Diagnostic visit:</strong> ${app.costs.diagnostic}</li>
      <li style="margin-bottom:8px;"><strong>Minor repairs:</strong> ${app.costs.minor}</li>
      <li style="margin-bottom:8px;"><strong>Standard repairs:</strong> ${app.costs.standard}</li>
      <li style="margin-bottom:8px;"><strong>Major repairs:</strong> ${app.costs.major}</li>
    </ul>
    <p>${app.costs.parts}. For ${cityDisplay} homeowners, this means most repairs are completed in a single visit — no second appointment, no waiting, and no extended downtime. Every repair includes our 90-day parts and labour warranty, and we always advise honestly if replacement makes more financial sense than repair.</p>

    <h2 ${H2_STYLE}>Warning Signs — Call Appliance Repair Near Me Immediately</h2>
    <p>If you notice any of the following ${appDisplay.toLowerCase()} symptoms in your ${cityDisplay} home, do not wait — call ${PHONE_LINK} for same-day service. Delaying can turn a simple repair into costly secondary damage:</p>
    <ul style="margin:12px 0 16px 20px;">
      <li style="margin-bottom:6px;">${app.warnings[0]}</li>
      <li style="margin-bottom:6px;">${app.warnings[1]}</li>
      <li style="margin-bottom:6px;">${app.warnings[2]}</li>
      <li style="margin-bottom:6px;">${app.warnings[3]}</li>
      <li style="margin-bottom:6px;">${app.warnings[4]}</li>
      <li style="margin-bottom:6px;">${app.warnings[5]}</li>
    </ul>
    <p>Same-day ${appDisplay.toLowerCase()} repair is available across ${cityDisplay} when you call before 2 PM. Our dispatch covers ${loc.neighbourhoods} — call ${PHONE_LINK} now.</p>

    <h2 ${H2_STYLE}>Why ${cityDisplay} Homeowners Choose Appliance Repair Near Me</h2>
    <p>Appliance Repair Near Me has built a strong reputation across ${cityDisplay} by delivering what matters most: fast response, honest pricing, and repairs that last. We understand ${loc.homeowners}, and we schedule around their lives — not the other way around. Here is why ${cityDisplay} residents trust us:</p>
    <ul style="margin:12px 0 16px 20px;">
      <li style="margin-bottom:6px;"><strong>Genuinely local technicians</strong> — dispatched from within the ${cityDisplay} area, not routed from across the GTA, for faster arrival times</li>
      <li style="margin-bottom:6px;"><strong>Same-day and next-day availability</strong> — including evening appointments Mon–Sat and Sunday service from 9 AM to 6 PM</li>
      <li style="margin-bottom:6px;"><strong>Upfront written quotes</strong> — you see the exact cost before any work begins, with no surprise charges after the repair</li>
      <li style="margin-bottom:6px;"><strong>90-day parts and labour warranty</strong> — if the same issue returns within 90 days, we fix it at no charge, no conditions</li>
      <li style="margin-bottom:6px;"><strong>All major brands serviced</strong> — Samsung, LG, Whirlpool, Bosch, GE, Frigidaire, Maytag, KitchenAid, Kenmore, and Miele</li>
    </ul>

    <h2 ${H2_STYLE}>Maintenance Tips for ${appDisplay} Owners in ${cityDisplay}</h2>
    <p>Preventive maintenance extends the life of your ${appDisplay.toLowerCase()} and reduces the likelihood of emergency repairs. ${loc.climate}. Here are five maintenance practices we recommend specifically for ${cityDisplay} homeowners:</p>
    <ol style="margin:12px 0 16px 20px;">
      <li style="margin-bottom:8px;">${app.maintenance[0]}</li>
      <li style="margin-bottom:8px;">${app.maintenance[1]}</li>
      <li style="margin-bottom:8px;">${app.maintenance[2]}</li>
      <li style="margin-bottom:8px;">${app.maintenance[3]}</li>
      <li style="margin-bottom:8px;">${app.maintenance[4]}</li>
    </ol>
    <p>Following these steps can add years to your ${appDisplay.toLowerCase()}'s lifespan and prevent the most common repair calls we see in ${cityDisplay}. If you notice anything unusual despite regular maintenance, call ${PHONE_LINK} — early diagnosis saves money.</p>

  </div>
</section>

`;
  return html;
}

// Process all files
const files = [];
const appliances = ['dishwasher', 'dryer', 'fridge'];
const cities = [
  'toronto', 'mississauga', 'brampton', 'scarborough', 'north-york',
  'etobicoke', 'vaughan', 'markham', 'richmond-hill', 'oakville',
  'burlington', 'ajax', 'pickering', 'oshawa', 'whitby', 'near-me'
];

let processed = 0;
let skipped = 0;
let errors = 0;

for (const appliance of appliances) {
  for (const city of cities) {
    const filename = `${appliance}-repair-${city}.html`;
    const filepath = path.join('C:/appliancerepairneary', filename);

    if (!fs.existsSync(filepath)) {
      console.log(`SKIP: ${filename} — file not found`);
      skipped++;
      continue;
    }

    let content = fs.readFileSync(filepath, 'utf8');

    // Check if already has extended content
    if (content.includes('class="extended-content"')) {
      console.log(`SKIP: ${filename} — already has extended content`);
      skipped++;
      continue;
    }

    // Find insertion point: before <section class="faq-section"
    const insertionPoint = content.indexOf('<section class="faq-section"');
    if (insertionPoint === -1) {
      console.log(`ERROR: ${filename} — no faq-section found`);
      errors++;
      continue;
    }

    const extendedContent = generateExtendedContent(appliance, city);
    if (!extendedContent) {
      console.log(`ERROR: ${filename} — no content data for ${appliance}/${city}`);
      errors++;
      continue;
    }

    // Insert before faq-section
    const newContent = content.slice(0, insertionPoint) + extendedContent + content.slice(insertionPoint);
    fs.writeFileSync(filepath, newContent, 'utf8');

    processed++;
    console.log(`OK: ${filename}`);
  }
}

console.log(`\n=== SUMMARY ===`);
console.log(`Processed: ${processed}`);
console.log(`Skipped: ${skipped}`);
console.log(`Errors: ${errors}`);
console.log(`Total: ${processed + skipped + errors}`);
