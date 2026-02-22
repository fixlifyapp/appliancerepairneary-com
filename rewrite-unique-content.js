// rewrite-unique-content.js
const fs = require('fs');
const path = require('path');
const BASE = 'C:/appliancerepairneary';
const PHONE = '(437) 524-1053';

const CITY_DATA = {
  toronto: {
    name: "Toronto", region: "the City of Toronto",
    housing: "dense condos, century-old detached homes from the 1910s-1930s, and post-war bungalows from the 1950s-70s",
    homeAge: "1950s-70s era",
    waterNote: "hard water drawn from Lake Ontario puts extra strain on internal hoses, valves, and heating elements",
    brands: "Samsung, LG, Whirlpool, Maytag, and Bosch",
    localRef: "neighbourhoods like The Annex, Leslieville, and Little Portugal",
    density: "dense urban environment means technicians navigate tight building access and parking restrictions daily",
    uniqueFact: "In high-rise condo buildings, which make up a large share of Toronto housing stock, even a single leaking appliance can trigger floor-below water damage claims, so a fast response is critical",
    tipService: {
      washer: "Hard Toronto water leaves mineral scale inside drum bearings and pump filters. Running a monthly hot-water cleaning cycle with white vinegar removes build-up and extends machine life significantly.",
      dryer: "Older Toronto houses with original ductwork often have long horizontal vent runs where lint accumulates. Have the duct professionally cleaned annually to prevent fire risk and cut drying times.",
      fridge: "Toronto condos often have fridges in closed kitchen alcoves with poor rear ventilation. Pulling the unit 2-3 inches from the wall reduces compressor strain and lowers the risk of breakdown.",
      dishwasher: "Lake Ontario supply water is moderately hard. Use rinse aid every cycle and run a dishwasher cleaner monthly to prevent limescale on spray arms and heating elements.",
      stove: "Many Toronto homes still have older gas connections from 1960s renovations. If you smell gas near the stove, leave the building and call Enbridge before calling us.",
      oven: "Toronto rental units and older condos often have self-cleaning ovens that have never been serviced. Avoid running a self-clean cycle if the door seal is cracked as it can trigger a thermal lockout."
    }
  },
  "north-york": {
    name: "North York", region: "North York",
    housing: "suburban mix of ranch-style bungalows from the 1960s-80s and Yonge corridor high-rise condos",
    homeAge: "1960s-80s era",
    waterNote: "moderately hard Toronto municipal water accelerates scale deposits in water-using appliances over time",
    brands: "Samsung, LG, Whirlpool, Frigidaire, and GE",
    localRef: "areas like Willowdale, Bayview Village, and Don Mills",
    density: "wide-ranging mix of low-density bungalow streets and high-density condo towers means technicians carry both under-counter and freestanding parts on every truck",
    uniqueFact: "Post-war ranch homes in North York were built with laundry tucked into compact utility corners, so accessing washer and dryer connections sometimes requires moving cabinetry before a repair can begin",
    tipService: {
      washer: "Older 1970s plumbing in North York bungalows can have slow drain lines. If your washer drains sluggishly, confirm the standpipe is clear before assuming the pump has failed.",
      dryer: "Ranch bungalows in North York often have short straight vent runs to an exterior wall. The exterior flap can stick shut in winter so check it each spring before the heavy drying season.",
      fridge: "North York condos along Yonge often have French-door fridges in galley kitchens. Vacuum the condenser coils every six months to maintain efficient cooling and prevent premature compressor failure.",
      dishwasher: "In older North York split-levels, the dishwasher drain hose sometimes sags below the connection point causing backflow odours. A simple high-loop bracket is often all that is needed.",
      stove: "Older North York bungalows often have 40-amp circuits wired for 1970s ranges. Newer glass-top stoves draw more current so verify your breaker rating before upgrading.",
      oven: "Many older North York homes have wall ovens installed in original 1970s cabinetry. When the bake element fails, we stock period-compatible element sizes to avoid a full oven replacement."
    }
  },
  etobicoke: {
    name: "Etobicoke", region: "Etobicoke",
    housing: "older bungalows and semi-detached homes from the 1950s-60s in family-oriented pockets like Bloor West Village and Mimico near the Humber River",
    homeAge: "1950s-60s era",
    waterNote: "some Etobicoke areas on older pipes see sediment that blocks washer inlet valve screens and dishwasher spray arm nozzles within two to three years",
    brands: "Whirlpool, Maytag, GE, Frigidaire, and Kenmore",
    localRef: "neighbourhoods like Runnymede, Long Branch, and Alderwood",
    density: "primarily low-rise residential streets with good parking access makes Etobicoke one of the more straightforward service areas in the GTA",
    uniqueFact: "Many Etobicoke bungalows were built with unfinished basements later converted to laundry rooms, often with non-standard drain configurations that require flexible repair approaches",
    tipService: {
      washer: "Etobicoke older plumbing sometimes uses 1.5-inch drain lines rather than the modern 2-inch standard. Repeated drain error codes may point to the pipe bore, not a failing pump.",
      dryer: "Near Mimico and Long Branch, summer lake humidity makes dryers work harder. Cleaning the moisture sensor bar inside the drum monthly restores accurate drying and prevents clothes over-drying.",
      fridge: "Etobicoke 1950s bungalows have tight kitchens where the fridge often sits beside an exterior wall. Cold winter drafts near the thermostat can cause short-cycling so check sensor placement before calling for a compressor repair.",
      dishwasher: "Older Etobicoke homes may have the dishwasher on a shared 15-amp circuit with the garbage disposal. Repeated tripping during cycles usually means the circuit needs separating, not a new appliance.",
      stove: "Many 1960s Etobicoke kitchens have original tile counters and tight stove cutouts. When replacing a burner, we measure clearances carefully to ensure the repair fits the existing layout.",
      oven: "Etobicoke Bloor West Village has many heritage semi-detached homes with narrow kitchens. Oven door hinge repairs are common here because doors are frequently bumped in tight cooking spaces."
    }
  },
  scarborough: {
    name: "Scarborough", region: "Scarborough",
    housing: "diverse mix of bungalows and semi-detached homes from the 1960s-80s, with high-rise towers in the east end near the Rouge Valley",
    homeAge: "1960s-80s era",
    waterNote: "eastern Toronto supply water has slightly higher mineral content near older distribution mains, which shortens the life of washing machine inlet valves and dishwasher spray arm nozzles",
    brands: "Samsung, LG, GE, Whirlpool, and Frigidaire",
    localRef: "neighbourhoods like Agincourt, Wexford, and Malvern",
    density: "combination of quiet residential streets and high-density apartment complexes means our technicians handle everything from basement laundry rooms to 20th-floor suites",
    uniqueFact: "Scarborough 1970s high-rises often have in-suite washer and dryer connections retrofitted into closets, tight spaces that demand compact tools and careful reassembly after every repair",
    tipService: {
      washer: "Stacked washer-dryer combos in Scarborough tower closets vibrate against shared walls. Anti-vibration pads under both units dramatically reduce noise complaints from neighbours.",
      dryer: "Scarborough tower apartments often have dryer vents travelling long horizontal distances to exterior walls. Lint restriction in these runs is the leading cause of dryers that run but will not heat.",
      fridge: "Scarborough east-end bungalows sometimes have a second fridge in a sunroom added in the 1980s. An unheated sunroom fridge can freeze up in winter so check the thermostat location before assuming the unit has failed.",
      dishwasher: "In Scarborough households with large cookware sets, overloading the spray arm coverage causes incomplete cleaning. Rearrange dishes so the bottom arm spins freely before assuming a mechanical fault.",
      stove: "Many Scarborough bungalows were updated in the 1990s with electric glass-top ranges. Glass cooktop cracks from thermal shock are a common call and the cooktop itself is replaceable without replacing the entire range.",
      oven: "Scarborough east end has many multigenerational homes where the oven runs multiple times daily. Heavy use accelerates bake-element failure and we keep common Whirlpool and Samsung elements in stock for same-day replacement."
    }
  },
  mississauga: {
    name: "Mississauga", region: "Peel Region",
    housing: "newer construction from the 1980s-2000s including large detached family homes, townhouses, and Square One-area condos",
    homeAge: "1980s-2000s era",
    waterNote: "Peel Region water from Lake Ontario is treated but moderately hard, and newer high-efficiency appliances in Mississauga are particularly sensitive to scale in heat exchangers and precision valves",
    brands: "Samsung, LG, Bosch, Whirlpool, and Maytag",
    localRef: "communities like Streetsville, Port Credit, Erin Mills, and Cooksville",
    density: "suburban grid layout with wide driveways and good parking access, though Square One condos present the same high-rise logistics as downtown Toronto",
    uniqueFact: "Mississauga larger family homes from the 1990s frequently have dedicated laundry rooms on the second floor, a convenience that becomes a major water-damage risk when a washer hose fails undetected",
    tipService: {
      washer: "Second-floor laundry rooms in Mississauga 1990s homes are a flood risk if inlet hoses fail. Replace standard rubber hoses with braided stainless steel every five years as a low-cost preventive measure.",
      dryer: "Erin Mills and Churchill Meadows townhouses often have dryer vents exiting through the roof. Roof-exit vents trap more lint and need cleaning every 12-18 months.",
      fridge: "Mississauga larger detached homes often have side-by-side fridges with in-door ice makers. Ice maker inlet valves are the single most common fridge repair in Peel Region and we stock replacements for every major brand.",
      dishwasher: "Newer Bosch and Miele dishwashers popular in Mississauga use condensation drying that requires rinse aid to function. If dishes are wet at cycle end, refilling the rinse aid dispenser is the first fix to try.",
      stove: "Mississauga 2000s-era homes are heavily electric with smooth-top ranges. A surface element that will not heat is typically a burnt-out element or a faulty infinite switch beneath the cooktop.",
      oven: "Gas ranges in Port Credit and Lakeview homes often develop igniter issues in humid summers near the lake. A weak igniter that clicks but will not light is a safety concern and should be replaced without delay."
    }
  },
  brampton: {
    name: "Brampton", region: "Peel Region",
    housing: "fast-growing suburb dominated by homes built in the 2000s-2010s, with large semi-detached and detached houses in communities like Castlemore and Heart Lake",
    homeAge: "2000s-2010s era",
    waterNote: "Peel Region water is shared with Mississauga, and Brampton newer high-efficiency appliances show premature scale build-up because their narrower water passages clog faster than older machines",
    brands: "Samsung, LG, Whirlpool, Bosch, and GE",
    localRef: "rapidly growing communities like Mount Pleasant, Sandalwood, and Brampton East",
    density: "wide residential streets in newer subdivisions make access straightforward, though rapid population growth means technicians often face peak same-day demand",
    uniqueFact: "Brampton has one of the fastest-growing populations in Canada, and many large households run appliances at twice the annual cycles compared to national averages, which accelerates wear on every moving part",
    tipService: {
      washer: "Larger Brampton households run 10-14 wash loads per week, far above the North American average. Using the heavy-duty cycle setting reduces motor stress, and splitting oversized loads eliminates excessive vibration.",
      dryer: "Brampton townhouse complexes sometimes share exterior vent exits between units. Confirm your dryer vent is not partially blocked by a neighbour vent cap as this is a common cause of poor drying performance.",
      fridge: "Newer Brampton homes from the 2010s often have counter-depth French-door fridges built into cabinetry. The tight enclosure limits air circulation around the condenser so clean it every six months.",
      dishwasher: "In large Brampton households, dishwashers run two or more full cycles daily. Heating elements and door seals wear faster at this frequency and annual inspection catches problems before a mid-cycle flood occurs.",
      stove: "Extended cooking sessions common in Brampton kitchens generate more grease than average. The continuous grate area traps grease that can block igniter ports and a monthly deep clean prevents ignition failures.",
      oven: "Many Brampton homes have slide-in gas ranges with cast-iron grates. Heavy pots placed unevenly over time can crack burner caps causing uneven flames, which is a straightforward and inexpensive part replacement."
    }
  },
  vaughan: {
    name: "Vaughan", region: "York Region",
    housing: "newer upscale suburb developed in the 1990s-2000s, with large custom homes in Woodbridge, Maple, and Thornhill communities featuring premium kitchen and laundry packages from European brands",
    homeAge: "1990s-2000s era",
    waterNote: "York Region water is drawn from Lake Ontario and treated, but Vaughan premium appliances especially European brands have tighter water-quality tolerances and benefit from filtered water connections",
    brands: "Miele, Bosch, Samsung, LG, and KitchenAid",
    localRef: "established communities like Woodbridge, Maple, Concord, and the Islington Avenue corridor",
    density: "wide suburban streets and large driveways make access easy, and most Vaughan homes have ground-floor utility rooms rather than basement-only laundry setups",
    uniqueFact: "Vaughan has a high concentration of Miele and Bosch appliances in custom-built homes, brands that require factory-certified parts and manufacturer-specific diagnostic tools which Appliance Repair Neary maintains",
    tipService: {
      washer: "Miele and Bosch front-loaders in Vaughan homes require specific drum seal lubricants during bearing replacement. Using generic parts voids the extended warranty so always confirm OEM-compatible components are used.",
      dryer: "Vaughan larger custom homes often have laundry rooms with complex duct routes. If your dryer runs full cycles but clothes stay damp, a partially restricted duct is almost always the cause, not a heating fault.",
      fridge: "Built-in Miele fridges in Vaughan estates require custom door panel realignment after internal repairs. Our technicians measure and level panels to factory spec to ensure the seal is perfectly restored.",
      dishwasher: "European dishwashers in Vaughan require descaling with branded tablets rather than generic citric acid, which can void manufacturer warranties. We carry approved cleaning kits for Miele and Bosch units.",
      stove: "Wolf and Thermador ranges in Vaughan kitchens have brass burner heads that corrode if cleaned with acidic agents. Use only mild soap on these surfaces to prevent pitting that affects burner performance.",
      oven: "Steam oven functions on premium Miele and Wolf units require the water tank to be descaled every 30 cycles. Ignoring the descale alert shuts down the steam function, which is not a failure but routine maintenance."
    }
  },
  markham: {
    name: "Markham", region: "York Region",
    housing: "newer subdivisions developed from the 1990s onward along the Highway 7 tech corridor, with a large diverse Asian community driving demand for Samsung and LG models prominent in those households",
    homeAge: "1990s-2000s era",
    waterNote: "York Region supply water carries enough mineral content to cause scale in dishwasher filters and washing machine pumps within two to three years of use",
    brands: "Samsung, LG, Bosch, Whirlpool, and Midea",
    localRef: "communities like Cornell, Unionville, Milliken, and Cathedraltown",
    density: "newer subdivision streets are easy to navigate, though rapid Markham development means technicians sometimes encounter multiple appliance makes and vintages in the same household",
    uniqueFact: "Markham tech-savvy households often own Wi-Fi connected Samsung and LG appliances that generate app-based error codes requiring manufacturer tool access, and our technicians carry the diagnostic accounts and software to interpret them",
    tipService: {
      washer: "Samsung smart washers in Markham homes often display DC or UE error codes. These almost always mean an unbalanced drum from bundled sheets so redistribute the load and restart before calling for service.",
      dryer: "LG sensor dryers in Markham households pick up fabric softener residue on the sensor bars over time. Wiping them monthly with rubbing alcohol restores accurate drying and prevents premature shutoffs.",
      fridge: "Samsung Family Hub fridges in Markham may stop cooling after a power outage until the touchscreen is rebooted. Hold the top-left and top-right buttons simultaneously for 10 seconds to force a restart.",
      dishwasher: "Markham households frequently run dishwashers with large Asian-style cookware. Angled or oversized items block spray arms so rearrange to confirm the bottom arm spins freely before assuming a mechanical fault.",
      stove: "High-output gas ranges used for wok cooking in Markham generate more grease than standard Western cooking. Igniter ports clog faster so inspect and clear them monthly to avoid ignition failures.",
      oven: "Markham Cornell and Cathedraltown communities have newer double-wall ovens from Samsung and LG. When one cavity stops heating, the control board rather than the element is often at fault and a diagnostic test confirms this before any part is ordered."
    }
  },
  "richmond-hill": {
    name: "Richmond Hill", region: "York Region",
    housing: "affluent suburb with a mix of older Mill Pond heritage homes from the 1970s-80s and newer luxury construction in Oak Ridges and Jefferson communities",
    homeAge: "1970s-2000s era",
    waterNote: "some Richmond Hill properties on older mains see higher sediment that blocks appliance inlet filters within 12-18 months of a fresh installation",
    brands: "Samsung, LG, Bosch, KitchenAid, and Miele",
    localRef: "established neighbourhoods like Mill Pond, Langstaff, Bayview Hill, and Oak Ridges",
    density: "mix of mature tree-lined streets in older areas and open newer subdivision roads gives technicians straightforward access across most of the municipality",
    uniqueFact: "Richmond Hill older Mill Pond homes have appliance nooks sized for 1970s machines, and newer full-depth models may not fit without cabinetry modification, so we always measure before recommending replacement over repair",
    tipService: {
      washer: "Some Richmond Hill homes on older distribution lines see brown water discolouration after city main flushing. Run a rinse-only cycle after any discolouration event to clear sediment before it settles in the pump filter.",
      dryer: "Oak Ridges area homes with longer lot setbacks have longer vent runs. A mid-run booster fan maintains the velocity needed to clear lint at those distances and can be installed during your service call.",
      fridge: "Bayview Hill upscale homes with integrated Bosch or Fisher and Paykel fridges need custom door panel realignment after internal repairs. Our technicians verify door seal integrity before closing any refrigeration service call.",
      dishwasher: "Richmond Hill newer Jefferson area homes often have Bosch 500 or 800 Series dishwashers. The third rack cutlery tray restricts water to the bottom rack when overfilled so keep it under 70% capacity for best wash results.",
      stove: "Richmond Hill Mill Pond heritage homes sometimes have original 1970s gas supply lines. We pressure-test the supply line connection before any gas range repair in these older properties.",
      oven: "KitchenAid double ovens in Richmond Hill newer homes have convection fans that vibrate loose over time causing rattling during bake cycles. Tightening the fan mounting bracket takes under 30 minutes and resolves the issue completely."
    }
  },
  ajax: {
    name: "Ajax", region: "Durham Region",
    housing: "growing commuter suburb with residential homes primarily built in the 1980s-2000s, with newer subdivisions on the north side attracting young families",
    homeAge: "1980s-2000s era",
    waterNote: "Durham Region water treatment draws from Lake Ontario and Ajax water carries enough calcium to deposit scale in dishwasher heating elements and washer drum seals after three to five years",
    brands: "Whirlpool, Samsung, LG, Maytag, and GE",
    localRef: "communities like Pickering Village area, Westney Heights, and Riverside Ajax",
    density: "well-planned suburban street grid with good access; Ajax is compact enough that a technician dispatched from the GTA typically arrives within 45-60 minutes",
    uniqueFact: "Ajax rapid growth as a commuter town means many residents work in Toronto and need evening or weekend appliance repair, so we prioritize out-of-hours availability specifically for Durham Region customers",
    tipService: {
      washer: "Ajax homes from the 1990s often have laundry hookups in finished basements with low ceilings. Front-loaders with pedestals may need the pedestal removed for drum or bearing access in tight basement spaces.",
      dryer: "Ajax newer north-end subdivisions often have vent runs longer than 25 feet to reach an exterior wall. At that length, smooth metal duct is required, not flexible foil, to maintain sufficient airflow.",
      fridge: "Ajax commuter families run large French-door fridges stocked for a week at a time. Overfilling the fresh-food compartment blocks air vents between the freezer and fridge sections causing uneven temperatures unrelated to the compressor.",
      dishwasher: "Durham Region water chemistry causes dishwasher filter screens to clog faster than manufacturers expect. Removing and rinsing the filter assembly monthly keeps spray pressure strong and prevents mid-cycle error codes.",
      stove: "Ajax newer subdivision homes usually have smooth-top electric ranges. Setting heavy cast-iron pans down hard on the glass surface is the most common cause of hairline cracks so use a trivet when moving heavy cookware.",
      oven: "Ajax homes built in the 2000s often have self-cleaning ovens that have run dozens of high-heat cycles. After each self-clean cycle, allow the oven to cool fully before attempting to unlock the door as forcing it causes latch failure."
    }
  },
  whitby: {
    name: "Whitby", region: "Durham Region",
    housing: "growing Durham Region community with newer subdivisions built primarily in the 1990s-2000s and ongoing development in north Whitby attracting young families and professionals",
    homeAge: "1990s-2000s era",
    waterNote: "Whitby municipal water is sourced from Lake Ontario and meets all standards, but its mineral content is slightly higher than Toronto water, making dishwasher rinse aid and monthly appliance cleaning particularly beneficial here",
    brands: "Whirlpool, Samsung, LG, Maytag, and Frigidaire",
    localRef: "communities like Brooklin, Port Whitby, Pringle Creek, and the downtown heritage area",
    density: "newer subdivision streets with good access; north Whitby rapid development means some newer addresses require GPS confirmation before dispatch",
    uniqueFact: "Whitby Brooklin community has seen explosive growth since 2015 with many homes under five years old and appliances still potentially within manufacturer warranty, and our technicians handle brand warranty procedures for every major manufacturer",
    tipService: {
      washer: "Newer Whitby homes with second-floor laundry on luxury vinyl plank flooring benefit from a washer overflow pan with a drain line. We can install one during a service visit to prevent flooring damage from future leaks.",
      dryer: "Whitby Brooklin townhomes may share rooftop dryer vent exits between units. If multiple units share a vent stack, restrictions affect all connected dryers and building management should arrange annual stack cleaning.",
      fridge: "Newer Whitby homes often have builder-grade Samsung or LG fridges with ice makers that were never connected because no water line was run. We can add a saddle valve connection during a service visit in most cases.",
      dishwasher: "Whitby newly built homes sometimes have dishwashers installed without the drain high-loop bracket, causing backflow from the sink. A foul-smelling dishwasher in a new home is often fixed by correcting the drain installation, not replacing the appliance.",
      stove: "Whitby Port area near the lake sees salt-air exposure that corrodes burner components faster than inland areas. An annual deep clean and burner cap inspection significantly extends gas range component life.",
      oven: "North Whitby newer homes often have slide-in ranges with front-control knobs. A burner that ignites but will not hold a flame typically has a weak thermocouple safety valve, a common repair that keeps the oven operating safely."
    }
  },
  oakville: {
    name: "Oakville", region: "Halton Region",
    housing: "affluent Halton town with upscale homes in Old Oakville and newer luxury developments near Sixteen Mile Creek, where homeowners invest in premium-brand appliances from European and American manufacturers",
    homeAge: "1960s-2000s era",
    waterNote: "Halton Region operates an excellent water treatment system, but Oakville premium appliances especially European imports often specify filtered water connections to protect precision valves from fine sediment",
    brands: "Miele, Bosch, Wolf, Sub-Zero, and KitchenAid",
    localRef: "established areas like Old Oakville, River Oaks, Glen Abbey, and Bronte",
    density: "wide tree-lined streets and ample parking in residential areas; Old Oakville heritage blocks may have tighter service vehicle access during busy periods",
    uniqueFact: "Oakville has one of the highest concentrations of Miele and Wolf appliances in the GTA, brands that require factory-certified parts and manufacturer-specific training which Appliance Repair Neary maintains for the Halton area",
    tipService: {
      washer: "Miele front-loaders in Oakville homes use a honeycomb drum requiring specific seal lubricant during drum bearing replacement. Using the wrong lubricant causes seal failure within six months so OEM-spec products are non-negotiable.",
      dryer: "Bosch heat-pump dryers popular in Oakville eco-conscious neighbourhoods condense moisture into a collection tank rather than venting outside. Emptying that tank after every two to three loads is the most commonly missed maintenance step.",
      fridge: "Sub-Zero and Wolf refrigeration in Oakville estates use a dual compressor system with a separate compressor for the freezer. Unusual warming in just the fridge section points to a faulty fresh-food evaporator, not the main compressor.",
      dishwasher: "Miele dishwashers in Oakville River Oaks and Glen Abbey homes have an automatic descaling program in the panel menu. Running it quarterly prevents expensive heating element replacement and keeps performance consistent.",
      stove: "Wolf dual-fuel ranges in Oakville kitchens have brass burner heads that expand and contract with heat. Persistent clicking after the burner lights usually means a wet or displaced burner cap so remove, dry, and reseat before calling for service.",
      oven: "Gaggenau and Wolf steam ovens in Oakville upscale kitchens have water filter cartridges that must be replaced every six months. A blocked filter reduces steam output and eventually triggers a fault code that prevents oven use."
    }
  },
  burlington: {
    name: "Burlington", region: "Halton Region",
    housing: "lakeside Halton city with older Aldershot homes from the 1950s-70s on the east side and newer Tyandaga and Millcroft neighbourhoods on the west, plus waterfront condos along Lake Ontario",
    homeAge: "1950s-2000s era",
    waterNote: "Burlington Lake Ontario proximity provides clean supply, though seasonal conditions can temporarily affect ice maker line water quality and pre-filters on ice maker connections are a worthwhile investment",
    brands: "Whirlpool, Samsung, LG, Bosch, and KitchenAid",
    localRef: "established communities like Aldershot, Brant Hills, Millcroft, and downtown Burlington",
    density: "Aldershot mature residential streets contrast with newer Millcroft subdivision grids and our technicians navigate both efficiently",
    uniqueFact: "Burlington Aldershot neighbourhood has some of the oldest housing in Halton Region, with 1950s homes and original electrical panels that sometimes lack the 240V outlets required for modern dryers, which we identify and flag during service calls",
    tipService: {
      washer: "Aldershot homes from the 1950s often have original copper plumbing with gate-valve shutoffs behind the washer that can seize open or closed. Replace them with modern ball valves for reliable emergency water control.",
      dryer: "Burlington waterfront condos with stacked laundry units in closets require moving the washer before the dryer can be fully disassembled for repair. Budget an extra 30 minutes for stack separation when booking.",
      fridge: "Burlington homes near the lakefront see high summer humidity that collects on fridge door seals, causing mould growth. Cleaning the door gasket monthly with a mild bleach solution keeps seals flexible and hygienic.",
      dishwasher: "Millcroft and Brant Hills homes from the 1990s often have older Maytag or Whirlpool dishwashers approaching end of life. If repair cost exceeds half the replacement value, we will tell you honestly and we do not push repairs that do not make financial sense.",
      stove: "Burlington older Aldershot bungalows sometimes have gas ranges on flexible accordion connectors that are now out of code. We flag these during stove repairs and recommend updated CSA-approved connectors for safety.",
      oven: "Burlington newer Millcroft homes favour convection ranges for family baking. If the convection fan runs during a non-convection cycle, the mode selector switch has failed, which is a simple part replacement taking under an hour."
    }
  },
  pickering: {
    name: "Pickering", region: "Durham Region",
    housing: "smaller Durham Region city with 1970s-80s subdivisions near the original town core and newer developments north of Highway 7, providing a mix of older and more recent housing stock",
    homeAge: "1970s-90s era",
    waterNote: "Pickering draws water from Lake Ontario near the shoreline east of Ajax and municipal water quality is consistent, though older homes on original mains can see occasional sediment that clogs appliance inlet screens",
    brands: "Whirlpool, GE, Samsung, Maytag, and Frigidaire",
    localRef: "communities like Bay Ridges, Liverpool, Rouge Park, and Claremont",
    density: "compact city with efficient street layouts; south Pickering older grid is straightforward to navigate while north Pickering newer areas have larger lots",
    uniqueFact: "Pickering Bay Ridges and Liverpool areas have some of the oldest housing in Durham Region, with 1970s homes that have seen multiple appliance generations and sometimes original electrical wiring that affects which modern appliances can be safely installed",
    tipService: {
      washer: "Older Pickering homes from the 1970s sometimes have original rubber washing machine hoses that are 40-50 years old. These hoses can fail without warning and replacing them with braided stainless steel on any service visit is strongly recommended.",
      dryer: "Pickering Bay Ridges homes near the lake can see winter condensation inside dryer vent lines, causing intermittent ignition failures in gas dryers. Insulating the vent duct in unheated crawl spaces prevents this seasonal problem.",
      fridge: "Pickering 1980s-era homes commonly have older side-by-side fridges that are less efficient but mechanically simpler than newer models. These units are cost-effective to repair because parts are widely available and the labour is straightforward.",
      dishwasher: "Pickering homes from the 1970s may still have original galvanized drain pipes under the sink. Dishwasher drain hose connections to galvanized pipes corrode and develop leaks, and checking this connection is part of every dishwasher service call.",
      stove: "Pickering Liverpool neighbourhood homes often have original 1980s electric ranges with coil burners. Coil burner element replacement is one of the least expensive appliance repairs, often completed in under 20 minutes.",
      oven: "Pickering newer north-end homes often have double-wall ovens in island kitchen designs. When one cavity stops heating, the cause is almost always a separate bake element for that cavity as they fail independently and are straightforward to replace."
    }
  },
  oshawa: {
    name: "Oshawa", region: "Durham Region",
    housing: "Durham Region largest city, with older homes from the 1940s-70s near the downtown core and newer suburbs north of the 401",
    homeAge: "1940s-70s era near downtown, newer suburbs in the north",
    waterNote: "Oshawa water system draws from Lake Ontario and older homes near downtown on original cast-iron mains can see occasional sediment events that clog washer inlet screens and ice maker filters",
    brands: "Whirlpool, GE, Maytag, Samsung, and Frigidaire",
    localRef: "neighbourhoods like Lakeview, O'Neill, Pinecrest, and Kedron",
    density: "mix of tight older downtown streets with limited parking and wide newer suburb roads, with technicians adapting dispatch routes based on which area of Oshawa is being served",
    uniqueFact: "Oshawa General Motors heritage has produced a community that values transparent, straightforward service and fair pricing over upsells, which aligns directly with how Appliance Repair Neary operates on every call",
    tipService: {
      washer: "Oshawa downtown homes often have basement laundry rooms with original 1960s drain pipes. Slow drains or backups may reflect root intrusion from mature trees and a plumber should clear the pipe before we address the washer itself.",
      dryer: "Oshawa workers neighbourhood bungalows were built with minimal utility clearances. Dryers in these tight spaces often have kinked flexible vent connectors behind the unit and replacing it with rigid duct dramatically improves performance.",
      fridge: "Oshawa Lakeview and O'Neill homes frequently have fridges that are 15-20 years old and still running. At that age, a compressor repair is typically not cost-effective and we will give you that honest assessment before recommending any major repair.",
      dishwasher: "The most common dishwasher service call across Oshawa is a unit that will not start. In the majority of cases the cause is a tripped door latch micro-switch, which is a low-cost part and not a major repair.",
      stove: "Oshawa downtown heritage homes sometimes still have original 1960s gas lines. We perform a visual inspection of the supply line connection for corrosion or deterioration before any gas range repair in these properties.",
      oven: "In Oshawa Kedron and Windfields north-end communities, newer homes have convection ovens used heavily for family baking. The bake element typically fails before the convection element so check the bake element first when baking results are uneven."
    }
  }
};

const SERVICE_DATA = {
  washer: {
    name: "Washer", fullName: "washer and washing machine",
    problems: ["not spinning","not draining","leaking water","making loud noise","vibrating violently","not starting","not filling with water"],
    commonIssues: "drum bearing failure, worn door seal, clogged pump filter, failed lid switch, blocked water inlet valve",
    costRange: "$120-$350",
    shortProblems: "not spinning, not draining, leaking, noisy operation, and failure to start"
  },
  dryer: {
    name: "Dryer", fullName: "dryer",
    problems: ["not heating","not tumbling","taking too long to dry","making unusual noise","overheating","not starting","stopping mid-cycle"],
    commonIssues: "burnt heating element, clogged lint trap or duct, failed thermostat, worn drum belt, faulty door switch",
    costRange: "$100-$300",
    shortProblems: "not heating, not tumbling, extended drying times, overheating, and stopping mid-cycle"
  },
  fridge: {
    name: "Refrigerator", fullName: "fridge and refrigerator",
    problems: ["not cooling","leaking water","ice maker not working","making noise","freezer not freezing","running constantly","frost buildup"],
    commonIssues: "failed evaporator fan, dirty condenser coils, faulty defrost heater, clogged drain tube, weak door gasket",
    costRange: "$130-$400",
    shortProblems: "not cooling, leaking water, ice maker failure, excessive noise, and freezer frost buildup"
  },
  dishwasher: {
    name: "Dishwasher", fullName: "dishwasher",
    problems: ["not draining","not cleaning properly","leaking","not starting","leaving dishes wet","making noise","not filling with water"],
    commonIssues: "clogged filter or spray arm, failed wash pump motor, blocked drain solenoid, broken door latch, worn door seal",
    costRange: "$110-$320",
    shortProblems: "not draining, poor cleaning results, leaking, not starting, and wet dishes after the cycle"
  },
  stove: {
    name: "Stove", fullName: "stove",
    problems: ["burner not lighting","burner clicking constantly","uneven flame","element not heating","control knob broken","glass top cracked","burner will not turn off"],
    commonIssues: "failed igniter, clogged burner port, worn burner switch, faulty surface element, broken control knob",
    costRange: "$100-$280",
    shortProblems: "burner ignition failure, constant clicking, uneven heat, element faults, and broken control knobs"
  },
  oven: {
    name: "Oven", fullName: "oven",
    problems: ["not heating","inaccurate temperature","not reaching set temperature","door will not close","error codes","self-clean not working","convection fan noisy"],
    commonIssues: "burnt bake or broil element, failed temperature sensor, worn door gasket, faulty control board, broken door hinge",
    costRange: "$110-$320",
    shortProblems: "not heating, inaccurate temperature, door seal failure, error codes, and convection fan noise"
  }
};

function hash(str) {
  return str.split("").reduce(function(acc,c){return acc+c.charCodeAt(0);},0);
}
function pick(arr,key){return arr[hash(key)%arr.length];}

function generateAnswerBox(city,service){
  var cd=CITY_DATA[city],sd=SERVICE_DATA[service];
  var v=[
    cd.name+" "+sd.name.toLowerCase()+" repair by Appliance Repair Neary: same-day service for "+cd.housing.split(",")[0]+" homes. We fix "+sd.shortProblems+". Typical cost "+sd.costRange+". 90-day warranty. Call "+PHONE+".",
    "Need "+sd.fullName+" repair in "+cd.name+"? Our "+cd.region+" technicians carry parts for "+cd.brands.split(",")[0]+", "+cd.brands.split(",")[1]+", and all major brands. Same-day availability, upfront pricing, 90-day warranty. Call "+PHONE+".",
    sd.name+" repair in "+cd.name+" — Appliance Repair Neary serves "+cd.region+" with certified technicians who know "+cd.homeAge+" homes. Common repairs: "+sd.commonIssues.split(",")[0]+" and "+sd.commonIssues.split(",")[1]+". Call "+PHONE+"."
  ];
  return pick(v,city+service+"ab");
}

function generateH2Local(city,service){
  var cd=CITY_DATA[city],sd=SERVICE_DATA[service];
  var v=[
    sd.name+" Repair Specialists Serving "+cd.name,
    "Trusted "+sd.name+" Repair for "+cd.name+" Homes",
    "Local "+sd.name+" Repair in "+cd.region
  ];
  return pick(v,city+service+"h2a");
}

function generateH2Problems(city,service){
  var cd=CITY_DATA[city],sd=SERVICE_DATA[service];
  var v=[
    "Common "+sd.name+" Problems We Fix in "+cd.name,
    sd.name+" Issues We Diagnose and Repair in "+cd.name,
    "What Causes "+sd.name+" Breakdowns in "+cd.name+" Homes"
  ];
  return pick(v,city+service+"h2b");
}

function generatePara1(city,service){
  var cd=CITY_DATA[city],sd=SERVICE_DATA[service];
  var v=[
    cd.name+" is a city defined by "+cd.housing+". That variety of housing stock means "+sd.fullName+" issues show up in all kinds of configurations — from basement utility rooms in post-war bungalows to kitchen-closet installations in modern condos. "+cd.uniqueFact+". Appliance Repair Neary holds same-day slots for "+cd.region+" customers because we know a broken "+sd.name.toLowerCase()+" rarely picks a convenient time.",
    "Servicing "+sd.fullName+" units across "+cd.name+" means working with the realities of "+cd.housing+". The "+cd.homeAge+" construction that defines much of "+cd.region+" shapes everything from how appliances were originally installed to which replacement parts are most likely needed on a given call. "+cd.uniqueFact+". Our technicians bring that local context to every "+cd.name+" job.",
    "In "+cd.name+", "+cd.density+". The city's "+cd.housing+" creates a wide range of "+sd.fullName+" installation scenarios that our technicians encounter every week. "+cd.uniqueFact+". That local knowledge is why Appliance Repair Neary maintains technicians in and around "+cd.region+" — faster arrival, better awareness of local building layouts, and the right parts on the van the first time."
  ];
  return pick(v,city+service+"p1");
}

function generatePara2(city,service){
  var cd=CITY_DATA[city],sd=SERVICE_DATA[service];
  var v=[
    "The "+cd.homeAge+" homes throughout "+cd.name+" were typically equipped with "+cd.brands+" — and those remain the brands we most frequently service in "+cd.region+" today. Beyond brand familiarity, "+cd.waterNote+". The combination of local water conditions and housing age means the most common "+sd.fullName+" failures in "+cd.name+" are "+sd.commonIssues+". We stock parts for these specific failure patterns before every "+cd.name+" dispatch.",
    "What distinguishes "+cd.name+" "+sd.fullName+" repair is the interplay between "+cd.homeAge+" construction and the brands dominant during those builds — primarily "+cd.brands+". On top of that, "+cd.waterNote+", which accelerates certain failure modes more than in other parts of the GTA. The issues we most regularly resolve in "+cd.name+" are "+sd.commonIssues+" — problems our technicians recognise on sight and carry appropriate parts for.",
    cd.name+" housing — primarily "+cd.housing+" — means "+sd.fullName+" units span a range of installation ages and configurations. The dominant brands in "+cd.region+" are "+cd.brands+", though we repair every make. One important local factor: "+cd.waterNote+". This directly causes "+sd.commonIssues.split(",")[0]+" and "+sd.commonIssues.split(",")[1]+" to develop faster in "+cd.name+" than manufacturer service intervals assume."
  ];
  return pick(v,city+service+"p2");
}

function generatePara3(city,service){
  var cd=CITY_DATA[city],sd=SERVICE_DATA[service];
  var v=[
    "Choosing Appliance Repair Neary for "+sd.name.toLowerCase()+" repair in "+cd.name+" means choosing a team that knows "+cd.localRef+" as well as they know the inside of a "+cd.brands.split(",")[0]+" unit. We stock common "+cd.name+"-area parts in our vans, completing most "+sd.fullName+" repairs in "+cd.region+" on the first visit. Pricing is confirmed upfront before any work starts, and every repair carries a 90-day parts and labour warranty.",
    "Appliance Repair Neary has handled "+sd.name.toLowerCase()+" calls across "+cd.region+" long enough to know which failures are most common in "+cd.name+" "+cd.homeAge+" homes, which brands appear most often in "+cd.localRef+", and what local conditions — like "+cd.waterNote.split(",")[0]+" — accelerate specific breakdowns. That knowledge means faster diagnostics and honest advice on whether repair or replacement is the better financial choice.",
    "When you book Appliance Repair Neary for "+sd.name.toLowerCase()+" service in "+cd.name+", you get a technician who has worked across "+cd.localRef+" and understands the quirks of "+cd.region+" homes. We confirm pricing before starting, carry parts matched to local failure patterns, and back every repair with a 90-day warranty. Same-day availability means your household is not without a working "+sd.name.toLowerCase()+" for days while waiting for a booking slot."
  ];
  return pick(v,city+service+"p3");
}

function generatePara4(city,service){
  var cd=CITY_DATA[city],sd=SERVICE_DATA[service];
  var tip=cd.tipService[service];
  var leads=[
    "<strong>"+cd.name+" "+sd.name+" Tip:</strong>",
    "<strong>Local Note for "+cd.name+" Residents:</strong>",
    "<strong>Technician Tip — "+cd.name+":</strong>"
  ];
  return pick(leads,city+service+"p4")+" "+tip;
}

function generateProblemsPara(city,service){
  var cd=CITY_DATA[city],sd=SERVICE_DATA[service];
  var v=[
    "The "+sd.fullName+" problems we encounter most in "+cd.name+" homes are: "+sd.problems.slice(0,5).join(", ")+". Each symptom has a distinct diagnostic path, and our technicians arrive with tools and parts for all of them. In most cases the repair is completed on the same visit — no waiting for parts to be ordered.",
    "In "+cd.name+", the most common reasons customers contact us about their "+sd.fullName+" are: "+sd.problems.join(", ")+". These issues are often connected to local factors like "+cd.waterNote.split(",")[0]+" or the age of the installation. We diagnose accurately before recommending any repair, and we do not replace parts that do not need replacing.",
    cd.name+" residents most often call about "+sd.fullName+" units that are "+sd.problems.slice(0,4).join(", or ")+". These symptoms typically point to "+sd.commonIssues+" — failure modes our team sees regularly across "+cd.region+". Because we pre-stock these parts, the diagnostic visit and the repair visit are usually the same appointment."
  ];
  return pick(v,city+service+"pp");
}

function rewriteContentSection(html,city,service){
  var cd=CITY_DATA[city];
  var nl=String.fromCharCode(10);
  var bsl=String.fromCharCode(92);var re=new RegExp('(<div class="content-body reveal">)(['+bsl+'s'+bsl+'S'+']*?)(</div>['+bsl+'r'+bsl+'n'+bsl+'s'+']*<!-- Repeated side card)');
  var newBody=
    '        <p>'+generatePara1(city,service)+'</p>'+nl
    +'<h2>'+generateH2Local(city,service)+'</h2>'+nl
    +'<p>'+generatePara2(city,service)+'</p>'+nl
    +'<ul>'+nl
    +'  <li>Certified appliance repair technicians serving '+cd.name+' and '+cd.region+'</li>'+nl
    +'  <li>Same-day and next-day slots available in '+cd.name+'</li>'+nl
    +'  <li>No fix, no fee guarantee on diagnostics (when repair is booked)</li>'+nl
    +'  <li>90-day parts and labour warranty on every repair</li>'+nl
    +'  <li>Evening and weekend availability for '+cd.name+' customers</li>'+nl
    +'</ul>'+nl
    +'<h2>'+generateH2Problems(city,service)+'</h2>'+nl
    +'<p>'+generateProblemsPara(city,service)+'</p>'+nl
    +'<p>'+generatePara4(city,service)+'</p>';
  return html.replace(re,function(m,g1,g2,g3){return g1+nl+newBody+nl+'      '+g3;});
}
function rewriteAnswerBox(html,city,service){
  var txt=generateAnswerBox(city,service);
  var nl=String.fromCharCode(10);
  var bsl=String.fromCharCode(92);
  var re=new RegExp('(<div[^>]*class="answer-box"[^>]*itemprop="description"[^>]*>)['+bsl+'s]*<p>[^<]*</p>['+bsl+'s]*(</div>)');
  return html.replace(re,function(m,g1,g2){return g1+nl+"          <p>"+txt+"</p>"+nl+"        "+g2;});
}
function extractFP(html){
  var text="";
  var bsl=String.fromCharCode(92);
  var reCS=new RegExp('<section[^>]*class="content-section"['+bsl+'s'+bsl+'S'+']+?</section>');
  var reAB=new RegExp('<div[^>]*class="answer-box"[^>]*>(['+bsl+'s'+bsl+'S'+']+?)</div>');
  var csM=html.match(reCS);
  if(csM) text+=csM[0].replace(/<[^>]+>/g," ");
  var abM=html.match(reAB);
  if(abM) text+=abM[1].replace(/<[^>]+>/g," ");
  return text.split(/s+/).filter(Boolean).join(" ").toLowerCase();
}
function shingleSim(a,b){
  var k=8;
  function sh(t){var w=t.split(" "),s={};for(var i=0;i<=w.length-k;i++)s[w.slice(i,i+k).join(" ")]=1;return s;}
  var sA=sh(a),sB=sh(b),kA=Object.keys(sA),kB=Object.keys(sB);
  if(!kA.length||!kB.length)return 0;
  var inter=kA.filter(function(x){return sB[x];}).length;
  return inter/(kA.length+kB.length-inter);
}

var EXCLUDE={"index.html":1,"about.html":1,"contact.html":1,"404.html":1,"pricing.html":1,"service-template.html":1};
var EXCPAT=["-near-me.html","washer-dryer-repair"];

function getServiceCity(filename){
  var svcs=["washer","dryer","fridge","dishwasher","stove","oven"];
  var cities=Object.keys(CITY_DATA);
  var svc=null;
  for(var i=0;i<svcs.length;i++){if(filename.indexOf(svcs[i]+"-repair-")===0){svc=svcs[i];break;}}
  if(!svc)return null;
  var after=filename.replace(svc+"-repair-","").replace(".html","");
  for(var j=0;j<cities.length;j++){if(after===cities[j])return{service:svc,city:cities[j]};}
  return null;
}

var allFiles=fs.readdirSync(BASE)
  .filter(function(f){return f.endsWith(".html");})
  .filter(function(f){return !EXCLUDE[f];})
  .filter(function(f){return !EXCPAT.some(function(p){return f.indexOf(p)!==-1;});});

var targetFiles=allFiles
  .map(function(f){return{file:f,parsed:getServiceCity(f)};})
  .filter(function(x){return x.parsed!==null;});

console.log("Found "+targetFiles.length+" service+city pages to rewrite.");
console.log("");

var updatedFP={};
var updatedCount=0;
var errorCount=0;

targetFiles.forEach(function(item){
  var file=item.file,svc=item.parsed.service,city=item.parsed.city;
  var fp=path.join(BASE,file);
  try{
    var html=fs.readFileSync(fp,"utf8");
    html=rewriteContentSection(html,city,svc);
    html=rewriteAnswerBox(html,city,svc);
    updatedFP[file]=extractFP(html);
    fs.writeFileSync(fp,html,"utf8");
    updatedCount++;
    console.log("OK  "+file);
  }catch(e){
    errorCount++;
    console.error("ERR "+file+" -- "+e.message);
  }
});

console.log("");
console.log("--- Uniqueness Analysis ---");

var sampleFile="washer-repair-toronto.html";
if(updatedFP[sampleFile]){
  var textA=updatedFP[sampleFile];
  var maxSim=0,maxPeer="";
  Object.keys(updatedFP).forEach(function(f){
    if(f===sampleFile)return;
    var sim=shingleSim(textA,updatedFP[f]);
    if(sim>maxSim){maxSim=sim;maxPeer=f;}
  });
  console.log("Most similar to "+sampleFile+": "+maxPeer);
  console.log("Jaccard similarity: "+(maxSim*100).toFixed(1)+"%");
  console.log("Uniqueness vs most-similar peer: "+(100-maxSim*100).toFixed(1)+"%");
}

var wFiles=Object.keys(updatedFP).filter(function(f){return f.indexOf("washer-repair-")===0;});
var wTot=0,wPairs=0;
for(var wi=0;wi<wFiles.length;wi++){
  for(var wj=wi+1;wj<wFiles.length;wj++){
    wTot+=shingleSim(updatedFP[wFiles[wi]],updatedFP[wFiles[wj]]);
    wPairs++;
  }
}
if(wPairs){
  var wAvg=wTot/wPairs;
  console.log("");
  console.log("Avg similarity across washer pages: "+(wAvg*100).toFixed(1)+"%");
  console.log("Avg uniqueness (washer pages): "+(100-wAvg*100).toFixed(1)+"%");
}

var fKeys=Object.keys(updatedFP);
var aTot=0,aPairs=0;
for(var ai=0;ai<fKeys.length;ai++){
  for(var aj=ai+1;aj<fKeys.length;aj++){
    aTot+=shingleSim(updatedFP[fKeys[ai]],updatedFP[fKeys[aj]]);
    aPairs++;
  }
}
if(aPairs){
  var aAvg=aTot/aPairs;
  console.log("");
  console.log("Avg similarity across ALL "+fKeys.length+" rewritten pages: "+(aAvg*100).toFixed(1)+"%");
  console.log("Avg uniqueness (all pages): "+(100-aAvg*100).toFixed(1)+"%");
}

console.log("");
console.log("--- Summary ---");
console.log("Pages rewritten: "+updatedCount);
console.log("Errors:          "+errorCount);
console.log("Total:           "+targetFiles.length);
