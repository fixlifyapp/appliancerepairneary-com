#!/usr/bin/env node
/**
 * generate-unique-content.js — Section variation strategy for NEARY
 *
 * Strategy: Create 8-12 variations of each large duplicated section,
 * assign each city a variation set by hashing city name, replace sections.
 * This covers ~60% of page content with unique text.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Simple string hash to deterministically pick variation for each city
function hashCity(city, max) {
  let h = 0;
  for (let i = 0; i < city.length; i++) {
    h = ((h << 5) - h + city.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % max;
}

// Second hash for independent variation selection
function hashCity2(city, max) {
  let h = 7;
  for (let i = 0; i < city.length; i++) {
    h = ((h * 31) + city.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % max;
}

// Third hash
function hashCity3(city, max) {
  let h = 13;
  for (let i = city.length - 1; i >= 0; i--) {
    h = ((h * 37) + city.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % max;
}

// ═══════════════════════════════════════════════════════════════════
// PROBLEM CARD VARIATIONS — 12 sets of 6 cards each
// Each set uses different wording, order, and emphasis
// ═══════════════════════════════════════════════════════════════════
const problemCardSets = {
  // For washer-repair pages
  'washer': [
    // Set 0
    [
      { icon: '&#128269;', title: 'Won\'t Start or Power On', desc: 'We check the power board, lid switch, thermal fuse, and control module. Most power issues are resolved in under an hour.' },
      { icon: '&#128166;', title: 'Water Leaking on Floor', desc: 'Leaks from door gaskets, pump seals, inlet hoses, or tub-to-pump connections. We locate the source and seal it same day.' },
      { icon: '&#128308;', title: 'Loud Banging or Grinding', desc: 'Worn drum bearings, failing shock absorbers, or loose counterweights. Continuing to run risks permanent tub damage.' },
      { icon: '&#9889;', title: 'Flashing Error Codes', desc: 'Samsung, LG, Whirlpool fault codes decoded on-site. We address the root electrical or mechanical cause — not just clear the display.' },
      { icon: '&#127777;', title: 'Won\'t Drain or Spin', desc: 'Clogged pump filter, failed drain motor, or broken lid switch. We clear blockages and replace worn components on the spot.' },
      { icon: '&#128683;', title: 'Unbalanced or Excessive Vibration', desc: 'Worn suspension rods, damaged springs, or unlevel installation. We rebalance and secure the unit to stop movement.' },
    ],
    // Set 1
    [
      { icon: '&#128166;', title: 'Leaking from Bottom', desc: 'Pump seal wear, cracked tub, or loose hose clamps cause puddles under the machine. Fast diagnosis prevents floor damage.' },
      { icon: '&#128269;', title: 'Completely Dead — No Lights', desc: 'Blown thermal fuse, failed door latch assembly, or tripped control board relay. Our multimeter testing pinpoints the exact component.' },
      { icon: '&#9889;', title: 'Stuck Mid-Cycle with Error', desc: 'The washer stops and displays a fault code. We retrieve manufacturer-specific codes and trace the failure to the responsible sensor or actuator.' },
      { icon: '&#128308;', title: 'Squealing During Spin', desc: 'A high-pitched squeal during spin indicates belt glazing, bearing wear, or a failing motor coupling. Early repair prevents costly secondary damage.' },
      { icon: '&#128683;', title: 'Door Won\'t Lock or Open', desc: 'Electronic door lock mechanism, broken handle, or swollen gasket. We carry replacement locks for Samsung, LG, and Whirlpool models.' },
      { icon: '&#127777;', title: 'Clothes Still Wet After Spin', desc: 'The drain pump runs but clothes remain soaked. Usually a worn clutch assembly, slipping belt, or failing motor capacitor.' },
    ],
    // Set 2
    [
      { icon: '&#128308;', title: 'Grinding Noise Every Cycle', desc: 'Drum bearing failure is progressive — early diagnosis avoids cracking the outer tub. We carry bearing kits for all major brands.' },
      { icon: '&#128166;', title: 'Slow Leak Behind Machine', desc: 'Hidden leaks from supply hose connections, fill valve weeping, or a cracked inlet manifold. We pressure-test every connection.' },
      { icon: '&#128269;', title: 'Starts Then Immediately Stops', desc: 'Door interlock failure, motor relay dropping out, or control board intermittent fault. Systematic electrical testing identifies the cause.' },
      { icon: '&#127777;', title: 'Water Won\'t Heat Up', desc: 'The heating element, thermistor, or inlet valve hot-side solenoid has failed. Cold-only washes leave detergent residue and reduce cleaning.' },
      { icon: '&#9889;', title: 'Repeated UE or OE Codes', desc: 'UE means unbalanced load; OE means drain obstruction. Recurring codes after reset indicate hardware failure requiring professional repair.' },
      { icon: '&#128683;', title: 'Detergent Drawer Overflows', desc: 'Clogged dispenser channels, excessive detergent use, or low water pressure restricting the rinse flow through the dispenser housing.' },
    ],
    // Set 3
    [
      { icon: '&#9889;', title: 'Error Code on Display', desc: 'Every brand uses unique fault codes. Our technicians decode Samsung, LG, Whirlpool, Bosch, and GE codes on the spot and fix the underlying issue.' },
      { icon: '&#128166;', title: 'Water Under the Machine', desc: 'Door boot gasket tears, pump housing cracks, or loose drain hose connections. We identify the source within 15 minutes of arrival.' },
      { icon: '&#128308;', title: 'Vibrates Across the Floor', desc: 'Worn suspension components, unlevel feet, or an unbalanced drum. We stabilize the unit and replace any damaged dampeners.' },
      { icon: '&#128269;', title: 'No Response When Pressing Start', desc: 'Control board relay failure, broken start button, or door switch not engaging. Electrical testing reveals the faulty component quickly.' },
      { icon: '&#128683;', title: 'Clothes Smell Musty After Wash', desc: 'Mould in the drum seal, clogged drain system, or standing water in the sump. We deep-clean and replace deteriorated gaskets.' },
      { icon: '&#127777;', title: 'Spin Cycle Extremely Slow', desc: 'Worn motor brushes, failing capacitor, or belt slippage reduce spin speed. Low spin leaves clothes too wet for efficient drying.' },
    ],
    // Set 4
    [
      { icon: '&#128166;', title: 'Front Loader Leaking from Door', desc: 'Torn or deformed door boot gasket, foreign object trapped in seal, or misaligned door hinge. Gasket replacement takes about 45 minutes.' },
      { icon: '&#128308;', title: 'Loud Thudding in Spin Cycle', desc: 'Damaged shock absorbers or snapped suspension springs let the tub hit the cabinet. Replacement restores quiet operation immediately.' },
      { icon: '&#9889;', title: 'Control Panel Unresponsive', desc: 'Moisture damage to the control board, failed ribbon cable, or power surge damage. We test and replace individual board components when possible.' },
      { icon: '&#128269;', title: 'Fills with Water but Won\'t Agitate', desc: 'Motor coupler break, agitator dog wear, or transmission failure. Top-loader-specific issues diagnosed through mechanical inspection.' },
      { icon: '&#127777;', title: 'Takes Too Long to Fill', desc: 'Restricted inlet valve, kinked supply hose, or low household water pressure. We measure flow rate and correct the restriction.' },
      { icon: '&#128683;', title: 'Burning Smell During Operation', desc: 'Overheating motor, seized bearing, or belt friction. Stop immediately and call for inspection — continued use risks fire.' },
    ],
    // Set 5
    [
      { icon: '&#128269;', title: 'Machine Won\'t Turn On', desc: 'We systematically test the power supply, door interlock, thermal fuse, and main control board to locate the exact failure point.' },
      { icon: '&#128308;', title: 'Rattling or Clicking Sounds', desc: 'Foreign objects in the drum, worn drum slides, or loose pump impeller. Quick identification prevents escalation to major repairs.' },
      { icon: '&#128166;', title: 'Overflow During Fill Cycle', desc: 'Failed water level sensor (pressure switch) or stuck inlet valve. Emergency shutoff and repair prevents flooding damage.' },
      { icon: '&#9889;', title: 'F21 or 5E Drain Error', desc: 'Blocked drain filter, failed pump motor, or kinked drain hose. We clear obstructions and test pump operation before leaving.' },
      { icon: '&#127777;', title: 'No Hot Water in Wash', desc: 'Hot water inlet valve failure, faulty water temperature sensor, or heating element burnout. Cold washes reduce cleaning effectiveness.' },
      { icon: '&#128683;', title: 'Excessive Foam in Drum', desc: 'Over-dosing HE detergent or using non-HE soap. We clean the system and advise on correct detergent amounts for your water hardness.' },
    ],
    // Set 6
    [
      { icon: '&#9889;', title: 'Persistent Fault Codes', desc: 'Codes that return after reset signal genuine hardware failure. We trace each code to the specific sensor, valve, or board component at fault.' },
      { icon: '&#128269;', title: 'Dead — No Indicator Lights', desc: 'Power board failure, blown line fuse, or faulty mains filter. We test the full electrical path from outlet to control module.' },
      { icon: '&#128166;', title: 'Dripping from Dispenser', desc: 'Clogged siphon cap, cracked dispenser housing, or water pressure surges pushing water through the detergent tray during fill.' },
      { icon: '&#128308;', title: 'Walking Across the Laundry Room', desc: 'Out-of-level installation, worn transport bolt damage, or failed leveling legs. We re-level and secure with anti-vibration pads.' },
      { icon: '&#128683;', title: 'Won\'t Complete Any Cycle', desc: 'Timer motor failure, intermittent door lock, or control board brownout. The machine starts but shuts down before finishing.' },
      { icon: '&#127777;', title: 'Drain Pump Runs Constantly', desc: 'Faulty pressure switch telling the control board water level is too high. The pump runs non-stop trying to empty an already-empty tub.' },
    ],
    // Set 7
    [
      { icon: '&#128166;', title: 'Slow Leak — Water on Floor', desc: 'Gradual tub seal wear, weeping hose clamp, or hairline crack in the outer tub. We inspect every potential leak point systematically.' },
      { icon: '&#128308;', title: 'Metallic Scraping Sound', desc: 'A coin, underwire, or button caught between the drum and tub. Left unattended it scratches the drum surface permanently.' },
      { icon: '&#9889;', title: 'Blinking Lights — No Start', desc: 'The control board is in diagnostic mode or has detected a fault before allowing the cycle to begin. We read the blink pattern to identify the issue.' },
      { icon: '&#128269;', title: 'Drum Doesn\'t Rotate', desc: 'Broken belt, seized motor, or failed motor coupling. We identify whether the blockage is mechanical or electrical.' },
      { icon: '&#127777;', title: 'Cold Rinse Only — No Hot', desc: 'Hot inlet valve solenoid has failed while cold continues working. The washer fills with cold water regardless of temperature setting.' },
      { icon: '&#128683;', title: 'Lid Won\'t Lock (Top Loader)', desc: 'Actuator failure, lid switch break, or wiring harness damage. The safety interlock prevents the spin cycle from engaging.' },
    ],
  ],
  // For dishwasher-repair pages
  'dishwasher': [
    // Set 0
    [
      { icon: '&#128269;', title: 'Not Cleaning Dishes', desc: 'Clogged spray arms, weak wash motor, or detergent dispenser failure. We restore full cleaning performance on the first visit.' },
      { icon: '&#128166;', title: 'Leaking from Bottom', desc: 'Worn door gasket, cracked sump, or loose hose clamp. We locate the leak source and repair it before water damages your flooring.' },
      { icon: '&#9889;', title: 'Error Codes Flashing', desc: 'Bosch E15, Samsung LC, LG AE — we decode manufacturer fault codes on-site and repair the underlying pump, sensor, or board issue.' },
      { icon: '&#128308;', title: 'Grinding or Humming Sounds', desc: 'Foreign object in the pump, worn wash motor bearings, or jammed chopper blade. Early repair prevents pump motor burnout.' },
      { icon: '&#127777;', title: 'Not Draining After Cycle', desc: 'Blocked drain filter, failed drain pump, or kinked drain hose. We clear the blockage and verify proper drainage flow.' },
      { icon: '&#128683;', title: 'Door Won\'t Latch Closed', desc: 'Broken latch mechanism, misaligned strike plate, or warped tub. The safety interlock prevents operation until the door seals.' },
    ],
    // Set 1
    [
      { icon: '&#128166;', title: 'Water Pooling Under Unit', desc: 'Door seal deterioration, inlet valve drip, or spray arm seal failure. Quick response prevents cabinet and flooring water damage.' },
      { icon: '&#128269;', title: 'Dishes Come Out Cloudy', desc: 'Hard water mineral film, malfunctioning rinse aid dispenser, or water temperature not reaching minimum wash threshold.' },
      { icon: '&#128308;', title: 'Unusual Noise Mid-Cycle', desc: 'Broken glass in the sump, worn circulation pump impeller, or loose spray arm bearing. We diagnose by cycle phase.' },
      { icon: '&#9889;', title: 'Won\'t Start — Lights Blink', desc: 'Control board communication error, failed door switch, or thermal fuse trip. Systematic testing isolates the failed component.' },
      { icon: '&#127777;', title: 'Water Stays Cold — No Heat', desc: 'Heating element burnout or thermostat failure means dishes dry poorly and sanitization cycle cannot complete properly.' },
      { icon: '&#128683;', title: 'Detergent Pod Not Dissolving', desc: 'Dispenser door spring broken, water not hot enough, or spray arm blocked by dish placement preventing water from reaching the cup.' },
    ],
    // Set 2
    [
      { icon: '&#9889;', title: 'Keeps Beeping — Won\'t Run', desc: 'The control board detects a fault before the cycle starts. We pull diagnostic codes and trace the problem to the exact component.' },
      { icon: '&#128166;', title: 'Leak from Door Edge', desc: 'Worn lower gasket, misaligned door, or cracked spray arm splashing water past the seal. Gasket replacement resolves most cases.' },
      { icon: '&#128269;', title: 'Food Residue After Full Cycle', desc: 'Blocked spray arm jets, failing wash pump, or incorrect water level. We restore cleaning power with targeted repairs.' },
      { icon: '&#128683;', title: 'Door Falls Open When Released', desc: 'Broken door springs, cable, or hinge mechanism. The door should hold its position — we replace the complete hinge assembly.' },
      { icon: '&#128308;', title: 'Rattling During Wash Phase', desc: 'Loose drain pump mounting, worn wash motor bushing, or broken chopper screen letting debris circulate in the pump.' },
      { icon: '&#127777;', title: 'Cycle Takes Over 3 Hours', desc: 'Heating element failure forces extended drying. The machine compensates by running longer but never reaches sanitization temperature.' },
    ],
    // Set 3
    [
      { icon: '&#128308;', title: 'Loud Buzzing When Running', desc: 'Wash motor startup capacitor failing, pump impeller hitting debris, or water inlet valve vibrating under pressure.' },
      { icon: '&#128166;', title: 'Dripping from Under the Door', desc: 'Lower door gasket compressed or torn, spray arm directing water at the seal gap, or overfill from a stuck inlet valve.' },
      { icon: '&#9889;', title: 'Display Shows Error — Won\'t Reset', desc: 'Persistent errors after power cycling indicate hardware failure. Flood sensors, thermistors, and pump motors are common culprits.' },
      { icon: '&#128269;', title: 'Top Rack Items Still Dirty', desc: 'Upper spray arm clogged with mineral deposits, low water pressure, or broken spray arm pivot seal reducing water flow.' },
      { icon: '&#127777;', title: 'Dishes Wet After Dry Cycle', desc: 'Failed heating element, broken vent fan, or rinse aid depleted. Proper drying requires all three systems working together.' },
      { icon: '&#128683;', title: 'Won\'t Drain — Standing Water', desc: 'Drain pump motor failure, blocked drain filter, or garbage disposal knockout plug not removed during installation.' },
    ],
    // Set 4
    [
      { icon: '&#128269;', title: 'Film on Glasses and Cutlery', desc: 'Hard water mineral deposits, failing rinse aid dispenser, or water heater not supplying hot enough water to the inlet.' },
      { icon: '&#128308;', title: 'Banging Sound During Drain', desc: 'Drain pump impeller broken, check valve stuck, or water hammer from sudden valve closure. We test pump and plumbing together.' },
      { icon: '&#128166;', title: 'Water Appears Under Cabinet', desc: 'Supply line connection drip, worn tub gasket, or cracked water inlet fitting. Hidden leaks can cause mould if not caught quickly.' },
      { icon: '&#9889;', title: 'Flashing Lights — No Response', desc: 'Main control board fault, ribbon cable corrosion, or power surge damage. We test board outputs before recommending replacement.' },
      { icon: '&#128683;', title: 'Soap Dispenser Stuck Shut', desc: 'Wax motor actuator failure, broken latch spring, or melted detergent blocking the mechanism. A simple fix that restores cleaning.' },
      { icon: '&#127777;', title: 'Interior Smells Bad', desc: 'Food debris in the filter or sump, standing water from drain issues, or mould in the door gasket groove. Deep cleaning required.' },
    ],
    // Set 5
    [
      { icon: '&#127777;', title: 'Water Not Hot Enough', desc: 'Internal heating element open-circuit, thermostat drift, or household hot water supply below 120°F. We test both internal and supply temperature.' },
      { icon: '&#128269;', title: 'White Spots on Everything', desc: 'Calcium and lime deposits from hard water. We check the rinse aid system, water softener salt level, and recommend treatment options.' },
      { icon: '&#128166;', title: 'Leak Only During Drain Phase', desc: 'Drain hose connection loose, pump housing gasket worn, or cracked drain sump. Phase-specific leaks narrow the diagnosis quickly.' },
      { icon: '&#128308;', title: 'Clicking When Starting', desc: 'Door latch relay cycling, wash motor trying to start against a jammed impeller, or drain valve solenoid chattering.' },
      { icon: '&#9889;', title: 'Controls Beep But Nothing Happens', desc: 'Control board receives input but cannot activate the fill valve, pump, or motor. Board relay testing identifies which output has failed.' },
      { icon: '&#128683;', title: 'Racks Won\'t Roll Smoothly', desc: 'Worn rack wheels, bent track rails, or broken rack adjuster. We carry replacement rollers and track assemblies for all major brands.' },
    ],
    // Set 6
    [
      { icon: '&#128166;', title: 'Small Puddle After Each Cycle', desc: 'Slow drip from worn inlet valve, weeping pump seal, or condensation from a failed vent. Persistent small leaks cause hidden damage.' },
      { icon: '&#128308;', title: 'Vibration Felt Through Countertop', desc: 'Loose mounting brackets, unlevel unit, or failing wash motor mount. We secure the dishwasher and eliminate transmitted vibration.' },
      { icon: '&#9889;', title: 'Cycle Stops Mid-Wash', desc: 'Thermal cutout tripping, water leak sensor activation, or door latch intermittent. We identify which safety system is interrupting.' },
      { icon: '&#128269;', title: 'Bottom Rack Items Dirtier Than Top', desc: 'Lower spray arm jets clogged with food or mineral scale. We remove, clean, and test water flow through every nozzle.' },
      { icon: '&#128683;', title: 'Won\'t Fill with Water', desc: 'Water inlet valve solenoid failure, float switch stuck, or water supply valve accidentally turned off. Quick diagnosis resolves it.' },
      { icon: '&#127777;', title: 'Rust Spots Inside the Tub', desc: 'Tub coating damage exposing the steel underneath. We assess whether the tub can be repaired with appliance-grade sealant or needs replacement.' },
    ],
    // Set 7
    [
      { icon: '&#128269;', title: 'Dirty Dishes After Normal Cycle', desc: 'Multiple causes: spray arm obstruction, low water temperature, failing detergent dispenser, or worn wash pump. Full diagnostic identifies the root cause.' },
      { icon: '&#9889;', title: 'Panel Lights Dim or Flicker', desc: 'Loose wiring connection, failing power supply board, or corroded wire terminal. Electrical issues need prompt professional attention.' },
      { icon: '&#128166;', title: 'Water Leaks from Air Gap', desc: 'Drain hose blockage, garbage disposal connection clogged, or air gap cap debris. We clear the entire drain path from dishwasher to disposal.' },
      { icon: '&#128308;', title: 'Scraping Noise from Spray Arm', desc: 'Dishes loaded too low catching the arm, warped arm, or broken arm bearing. We inspect clearance and replace damaged components.' },
      { icon: '&#127777;', title: 'Steam from Door During Cycle', desc: 'Door vent blocked, gasket not sealing at the top, or unit overfilling and creating excess steam. We check seal and water level.' },
      { icon: '&#128683;', title: 'Child Lock Activated — Can\'t Cancel', desc: 'Button sequence lockout, failed control panel overlay, or board stuck in lock mode. We reset the control system properly.' },
    ],
  ],
  // For dryer-repair pages
  'dryer': [
    // Set 0
    [
      { icon: '&#127777;', title: 'Not Heating At All', desc: 'Blown thermal fuse, failed heating element, or gas igniter malfunction. We test the complete heat circuit and repair same day.' },
      { icon: '&#128308;', title: 'Loud Thumping or Squealing', desc: 'Worn drum rollers, frayed belt, or dry idler pulley bearing. Continuing to run risks belt snapping and drum damage.' },
      { icon: '&#128269;', title: 'Won\'t Start When Button Pressed', desc: 'Door switch failure, broken start switch, or blown thermal fuse. We test each component in sequence to find the exact fault.' },
      { icon: '&#9889;', title: 'Runs But Clothes Stay Damp', desc: 'Restricted airflow from a clogged vent line, failed cycling thermostat, or element only partially heating. Full diagnostic on first visit.' },
      { icon: '&#128166;', title: 'Condensation on Windows Nearby', desc: 'Blocked or disconnected exhaust vent directing moist air into the room. Vent inspection and cleaning resolves the humidity issue.' },
      { icon: '&#128683;', title: 'Drum Doesn\'t Tumble', desc: 'Broken drive belt, seized motor, or failed motor switch. We carry belts and pulleys for all common dryer models.' },
    ],
    // Set 1
    [
      { icon: '&#128308;', title: 'Scraping Metal Sound', desc: 'Drum glides or felt seal worn through, exposing bare metal contact. Prompt replacement prevents permanent drum damage.' },
      { icon: '&#127777;', title: 'Takes Multiple Cycles to Dry', desc: 'Partially blocked vent duct, failing heating element, or moisture sensor coated with fabric softener residue.' },
      { icon: '&#128269;', title: 'Dead — No Lights or Response', desc: 'Tripped breaker, blown internal fuse, or door switch not engaging. We test from the power source inward.' },
      { icon: '&#9889;', title: 'Shuts Off After 5 Minutes', desc: 'Overheating thermostat tripping due to restricted airflow, failed thermistor, or cycling thermostat malfunction.' },
      { icon: '&#128683;', title: 'Door Won\'t Stay Closed', desc: 'Worn door catch, broken latch spring, or misaligned strike. The safety switch prevents operation until the door seals properly.' },
      { icon: '&#128166;', title: 'Musty Smell from Clothes', desc: 'Lint buildup harbouring moisture and bacteria inside the cabinet, blocked vent creating humid conditions, or drum seal leak.' },
    ],
    // Set 2
    [
      { icon: '&#127777;', title: 'Heat Comes and Goes', desc: 'Cycling thermostat failing, intermittent element connection, or gas valve coil weakening. Inconsistent heat extends drying time significantly.' },
      { icon: '&#128269;', title: 'Starts Then Stops Immediately', desc: 'Motor centrifugal switch failure, thermal overload tripping, or door switch intermittent. Systematic testing reveals which component drops out.' },
      { icon: '&#128308;', title: 'Rhythmic Thumping Every Rotation', desc: 'Flat spot on drum support roller or worn drum bearing. The thump matches drum rotation speed — easy to diagnose by ear.' },
      { icon: '&#9889;', title: 'Control Panel Shows Error', desc: 'Samsung, LG, and Whirlpool dryers display fault codes for thermistor failures, motor issues, and vent restrictions. We decode and resolve.' },
      { icon: '&#128166;', title: 'Lint Everywhere But the Trap', desc: 'Torn lint screen housing, gap in the exhaust duct, or damaged blower housing seal. Escaped lint is a fire hazard needing immediate repair.' },
      { icon: '&#128683;', title: 'Timer Won\'t Advance', desc: 'Failed timer motor or corroded timer contacts. The dryer runs indefinitely on one cycle segment without progressing.' },
    ],
    // Set 3
    [
      { icon: '&#9889;', title: 'Error Code on Display', desc: 'Modern dryers display diagnostic codes for component failures. We read the code, verify the diagnosis with testing, and repair the fault.' },
      { icon: '&#127777;', title: 'Gas Dryer Won\'t Ignite', desc: 'Failed igniter, weak gas valve coils, or faulty flame sensor. Gas dryer heating diagnosis requires safe, methodical testing of each ignition component.' },
      { icon: '&#128308;', title: 'High-Pitched Squeal', desc: 'Idler pulley bearing dry or failing, belt glazed and slipping, or motor bearing worn. A new belt and pulley kit restores quiet operation.' },
      { icon: '&#128269;', title: 'Drum Light Works But Won\'t Run', desc: 'Power reaches the unit but the motor won\'t engage — failed start switch, seized motor, or broken belt preventing the belt switch from closing.' },
      { icon: '&#128166;', title: 'Hot Outside the Dryer Cabinet', desc: 'Exhaust vent blockage forcing hot air back through cabinet gaps. Fire hazard — requires immediate vent cleaning and inspection.' },
      { icon: '&#128683;', title: 'Clothes Come Out Wrinkled', desc: 'Overdrying from faulty moisture sensor, tumble action reduced by worn drum fins, or incorrect heat setting from failed selector switch.' },
    ],
    // Set 4
    [
      { icon: '&#128269;', title: 'Won\'t Power On', desc: 'No response from the control panel — we check the thermal fuse, door switch, power supply, and main board to locate the break in the circuit.' },
      { icon: '&#128308;', title: 'Rumbling or Growling', desc: 'Drum roller bearings flat-spotted from age, or drum bearing worn at the rear shaft. Roller replacement is a standard 45-minute repair.' },
      { icon: '&#127777;', title: 'Only Blows Cold Air', desc: 'Electric element open-circuit, gas igniter cracked, or high-limit thermostat tripped and won\'t reset. Full heating system diagnosis included.' },
      { icon: '&#9889;', title: 'Beeps But Won\'t Start Cycle', desc: 'Door switch not registering closed, control board relay stuck, or motor overload tripped. We test each stage of the start circuit.' },
      { icon: '&#128683;', title: 'Strong Burning Smell', desc: 'Lint ignition, belt friction, or motor overheating. Stop the dryer immediately and call for inspection — this is a potential fire risk.' },
      { icon: '&#128166;', title: 'Moisture on Walls Near Dryer', desc: 'Vent duct disconnected inside the wall, crushed transition hose, or exhaust damper stuck closed. We inspect the full vent run.' },
    ],
    // Set 5
    [
      { icon: '&#127777;', title: 'Low Heat Only — Never Gets Hot', desc: 'One heating element coil burned out (electric), or gas valve opens partially. Half-heat means double drying time and higher energy bills.' },
      { icon: '&#128308;', title: 'Clunking When Drum Turns', desc: 'Broken drum baffle, loose screw inside the drum, or worn drum slide. We inspect the interior and replace damaged components.' },
      { icon: '&#128269;', title: 'Motor Hums But Drum Stays Still', desc: 'Broken drive belt or seized drum bearing. The motor runs but has nothing to turn. Belt replacement is quick and affordable.' },
      { icon: '&#9889;', title: 'Cycle Ends Too Quickly', desc: 'Moisture sensor reading wet clothes as dry due to fabric softener buildup, or thermistor giving false high-temperature readings.' },
      { icon: '&#128166;', title: 'Water Dripping Inside the Drum', desc: 'Exhaust vent condensation flowing back into the dryer. Long vent runs or vent routing through cold spaces causes this in winter.' },
      { icon: '&#128683;', title: 'Lint Trap Catches Almost Nothing', desc: 'Screen mesh torn, housing seal broken, or secondary lint path allowing debris to bypass the filter. This reduces efficiency and creates fire risk.' },
    ],
    // Set 6
    [
      { icon: '&#128308;', title: 'Loud Pop When Starting', desc: 'Belt tension snap, motor start winding engaging hard, or loose blower wheel hitting housing. We identify the source and eliminate the noise.' },
      { icon: '&#127777;', title: 'Overheating — Clothes Too Hot', desc: 'Cycling thermostat stuck closed, blocked exhaust vent, or failed high-limit thermostat. Overheating damages clothes and risks fire.' },
      { icon: '&#128269;', title: 'Display Shows Time But Won\'t Run', desc: 'Start relay on the control board failed, motor capacitor dead, or safety circuit open. Electronic diagnostics pinpoint the issue.' },
      { icon: '&#9889;', title: 'Stops and Restarts Randomly', desc: 'Intermittent door switch, loose wiring connection, or control board relay chattering. Inconsistent operation wastes energy and time.' },
      { icon: '&#128166;', title: 'Vent Flap Won\'t Open Outside', desc: 'Bird nest, lint accumulation, or frozen condensation blocking the exterior vent cap. We clean and test the full vent from dryer to exit.' },
      { icon: '&#128683;', title: 'Timer Knob Spins Freely', desc: 'Broken timer shaft or stripped timer knob coupling. The timer dial turns but doesn\'t engage the timer mechanism inside.' },
    ],
    // Set 7
    [
      { icon: '&#128269;', title: 'Trips the Circuit Breaker', desc: 'Shorted heating element, grounded motor winding, or damaged power cord. Electrical fault diagnosis required before safe operation.' },
      { icon: '&#128308;', title: 'Vibration Felt Through Floor', desc: 'Dryer not level, worn leveling feet, or drum out of round. We re-level the unit and replace any damaged support components.' },
      { icon: '&#127777;', title: 'Dries Unevenly — Some Items Wet', desc: 'Blocked airflow path, reduced drum rotation from slipping belt, or failed moisture sensor reading incorrectly.' },
      { icon: '&#9889;', title: 'All Lights On But No Action', desc: 'Control board powering up but unable to activate the motor relay. Board-level diagnosis determines if repair or replacement is needed.' },
      { icon: '&#128683;', title: 'Static Cling Worse Than Usual', desc: 'Overdrying from failed auto-dry sensor, or dryer sheets not releasing properly due to dispenser issues. Calibration and cleaning help.' },
      { icon: '&#128166;', title: 'White Dust on Dark Clothes', desc: 'Calcium deposits from hard water on drum surface, deteriorating felt seal shedding particles, or lint screen housing breakdown.' },
    ],
  ],
  // For fridge-repair pages
  'fridge': [
    [
      { icon: '&#127777;', title: 'Not Cooling at All', desc: 'Compressor failure, refrigerant leak, or condenser fan stopped. Food safety requires diagnosis within hours — we prioritize fridge calls.' },
      { icon: '&#128166;', title: 'Water Pooling Inside', desc: 'Clogged defrost drain, cracked drain pan, or frozen evaporator coil forcing melt water to overflow. We clear and test the drainage path.' },
      { icon: '&#128308;', title: 'Loud Buzzing or Clicking', desc: 'Compressor struggling to start, failing start relay, or condenser fan motor bearing worn. Early repair avoids compressor burnout.' },
      { icon: '&#9889;', title: 'Temperature Fluctuates', desc: 'Faulty thermostat, damaged door gasket, or dirty condenser coils causing the compressor to cycle erratically.' },
      { icon: '&#128683;', title: 'Ice Maker Stopped Working', desc: 'Frozen fill tube, failed water inlet valve, or ice maker module failure. We test each component in the ice-making chain.' },
      { icon: '&#128269;', title: 'Runs Constantly Non-Stop', desc: 'Compressor never shuts off — dirty coils, leaking door seal, or low refrigerant forcing continuous operation and high energy bills.' },
    ],
    [
      { icon: '&#128166;', title: 'Leak Under the Fridge', desc: 'Cracked drain pan, leaking water inlet valve, or ice maker overflow. We locate the water source and stop it before floor damage spreads.' },
      { icon: '&#127777;', title: 'Freezer Cold But Fridge Warm', desc: 'Evaporator fan failure, blocked air duct, or damper door stuck closed. Cold air is made but not circulated to the refrigerator side.' },
      { icon: '&#128308;', title: 'Compressor Clicks Then Stops', desc: 'Failed compressor start relay or overload protector tripping. The compressor tries to start but cannot sustain operation.' },
      { icon: '&#9889;', title: 'Error Code on Display Panel', desc: 'Samsung, LG, and Whirlpool fridges show diagnostic codes for sensor failures, fan issues, and defrost problems. We decode on-site.' },
      { icon: '&#128683;', title: 'Door Won\'t Seal Properly', desc: 'Worn or deformed gasket, misaligned hinges, or debris in the gasket channel. Poor seal wastes energy and reduces cooling.' },
      { icon: '&#128269;', title: 'Strange Odour Inside', desc: 'Failed evaporator drain allowing stagnant water, mould in drip tray, or defrost heater burning dust. Deep cleaning and repair needed.' },
    ],
    [
      { icon: '&#127777;', title: 'Freezer Not Freezing', desc: 'Defrost heater failure, frosted evaporator coils, or sealed system refrigerant loss. We test the complete cold chain.' },
      { icon: '&#128308;', title: 'Rattling from Back of Fridge', desc: 'Condenser fan hitting ice or debris, loose compressor mounting, or drain pan vibrating. Quick inspection reveals the source.' },
      { icon: '&#128166;', title: 'Water Dispenser Drips', desc: 'Water inlet valve not sealing fully, trapped air in the line, or cracked reservoir. We test valve pressure and replace if needed.' },
      { icon: '&#128269;', title: 'Light On But Nothing Runs', desc: 'Start relay failure, overload protector open, or compressor winding burnt out. Electrical testing determines repair vs. replace.' },
      { icon: '&#9889;', title: 'Beeping Alarm Won\'t Stop', desc: 'Door ajar sensor triggered, temperature risen above threshold, or control board false alarm. We diagnose and silence the cause.' },
      { icon: '&#128683;', title: 'Ice Buildup in Freezer', desc: 'Failed defrost timer, heater, or thermostat creating excessive frost. Manual defrost is temporary — the defrost system needs repair.' },
    ],
    [
      { icon: '&#128269;', title: 'Compressor Runs But No Cold', desc: 'Refrigerant leak, blocked capillary tube, or failed compressor valves. Sealed system diagnosis requires specialized gauges and training.' },
      { icon: '&#128166;', title: 'Water on Floor Near Front', desc: 'Overflowing drip pan, clogged defrost drain sending water forward, or ice maker leak dripping down the front interior.' },
      { icon: '&#128308;', title: 'Rhythmic Knocking Sound', desc: 'Compressor mounting springs worn, evaporator fan blade hitting frost, or loose condenser fan shroud. We identify and fix the noise source.' },
      { icon: '&#127777;', title: 'Food Freezing in the Fridge', desc: 'Thermostat set too low, damper door stuck open, or thermistor reading incorrectly. Food should stay between 1-4°C without freezing.' },
      { icon: '&#9889;', title: 'Display Panel Blank', desc: 'Power board failure, display ribbon cable loose, or main board not sending signal to the display. We test the electronic chain.' },
      { icon: '&#128683;', title: 'Water Dispenser Very Slow', desc: 'Clogged water filter past replacement date, low household water pressure, or frozen water line in the door.' },
    ],
    [
      { icon: '&#127777;', title: 'Fridge and Freezer Both Warm', desc: 'Complete cooling failure — compressor not running, sealed system leak, or both fans inoperative. Emergency service available.' },
      { icon: '&#128308;', title: 'Humming Louder Than Normal', desc: 'Condenser coils clogged with dust, compressor working harder than designed, or evaporator fan motor bearing worn.' },
      { icon: '&#128166;', title: 'Ice on Back Wall of Fridge', desc: 'Defrost drain frozen shut, evaporator coils over-frosted, or door left slightly open. We clear ice and repair the defrost system.' },
      { icon: '&#128269;', title: 'Interior Light Not Working', desc: 'Bulb burned out, socket failure, or door switch not triggering. LED light assemblies on modern fridges require specific replacement parts.' },
      { icon: '&#9889;', title: 'Touchscreen Unresponsive', desc: 'Samsung and LG smart fridges have touchscreen displays that can fail from moisture ingress, static damage, or ribbon cable corrosion.' },
      { icon: '&#128683;', title: 'Draws Won\'t Open Smoothly', desc: 'Broken drawer slide, cracked drawer housing, or humidity drawer mechanism seized. We carry common drawer parts for quick replacement.' },
    ],
    [
      { icon: '&#128166;', title: 'Condensation on Outside', desc: 'Anti-sweat heater failure, high ambient humidity, or door gasket not sealing. Exterior moisture indicates an efficiency problem.' },
      { icon: '&#127777;', title: 'Temperature Swings Up and Down', desc: 'Main control board relay failing, thermostat calibration drift, or condenser coils restricting heat dissipation.' },
      { icon: '&#128308;', title: 'Clicking Every Few Minutes', desc: 'Start relay attempting to kick-start a struggling compressor. Repeated clicking without the compressor catching is a relay or compressor issue.' },
      { icon: '&#128269;', title: 'Fridge Won\'t Turn Off', desc: 'Thermostat contacts welded shut, control board stuck in cooling mode, or extremely dirty condenser coils preventing heat release.' },
      { icon: '&#9889;', title: 'Flashing Temperature Display', desc: 'Temperature has risen above safe threshold — power outage recovery, door left open, or cooling system failure. Check food safety first.' },
      { icon: '&#128683;', title: 'Dispenser Makes Ice But No Water', desc: 'Water line frozen in the door, inlet valve partially failed, or filter restriction. Water and ice systems share the same supply.' },
    ],
    [
      { icon: '&#128308;', title: 'Fan Noise from Inside Freezer', desc: 'Evaporator fan blade hitting ice, motor bearing failing, or fan shroud cracked and vibrating. We access and replace the fan assembly.' },
      { icon: '&#127777;', title: 'Only One Side Cooling', desc: 'Side-by-side with one warm section — damper motor failure, fan inoperative, or air duct blocked by ice. We test airflow distribution.' },
      { icon: '&#128166;', title: 'Drip Tray Overflows', desc: 'Excessive frost defrosting faster than the pan can evaporate, cracked drain tube, or condenser fan not helping evaporation.' },
      { icon: '&#128269;', title: 'Compressor Extremely Hot', desc: 'Overworking from dirty coils, low refrigerant, or failed fan. An overheated compressor trips the overload and cycles off repeatedly.' },
      { icon: '&#9889;', title: 'WiFi Features Stopped Working', desc: 'Smart fridge connectivity issues — router change, firmware glitch, or main board network module failure. We diagnose the electronic side.' },
      { icon: '&#128683;', title: 'Vegetable Crisper Freezing', desc: 'Air duct directing cold air directly into the crisper, thermostat reading low, or damper stuck open. Adjustment or part replacement fixes it.' },
    ],
    [
      { icon: '&#127777;', title: 'Warm Spots Inside Fridge', desc: 'Blocked air vents from overpacking, failed circulation fan, or frost buildup on the evaporator reducing airflow.' },
      { icon: '&#128166;', title: 'Water in Bottom of Freezer', desc: 'Defrost drain blocked with ice, drain heater failed, or drain tube routed incorrectly during previous service. We clear and heat-trace the drain.' },
      { icon: '&#128308;', title: 'Vibration Through Kitchen Floor', desc: 'Fridge not level, compressor mounting grommets hardened, or condenser fan unbalanced. We re-level and replace worn mounts.' },
      { icon: '&#128269;', title: 'Shelves Cracked or Broken', desc: 'Tempered glass shelf shattered from temperature shock, plastic shelf support tabs snapped, or wire shelf rust-through. We source replacements.' },
      { icon: '&#9889;', title: 'Keeps Tripping the Breaker', desc: 'Compressor winding shorted to ground, damaged power cord, or defrost heater insulation failure. Electrical fault requires professional testing.' },
      { icon: '&#128683;', title: 'French Door Gap Letting Air In', desc: 'Cam-style hinge worn, door alignment off, or center mullion gasket flattened. Gap allows warm air in and cold air out continuously.' },
    ],
  ],
  // For oven-repair pages
  'oven': [
    [
      { icon: '&#127777;', title: 'Not Heating Up', desc: 'Bake or broil element burned out, igniter failing, or thermostat miscalibrated. We carry elements and igniters for same-day repair.' },
      { icon: '&#128308;', title: 'Unusual Clicking Sound', desc: 'Gas igniter sparking continuously, relay chattering, or cooling fan hitting debris. We isolate the noise source quickly.' },
      { icon: '&#9889;', title: 'Error Code on Display', desc: 'Thermistor fault, door lock failure, or control board error. We decode the specific code and replace the failed component.' },
      { icon: '&#128269;', title: 'Uneven Cooking Results', desc: 'Failed convection fan, damaged element heating unevenly, or thermostat reading 20-50 degrees off actual temperature.' },
      { icon: '&#128683;', title: 'Door Won\'t Close Properly', desc: 'Bent hinge, broken spring, or warped gasket. An unsealed door wastes energy and causes uneven cooking temperatures.' },
      { icon: '&#128166;', title: 'Self-Clean Lock Won\'t Release', desc: 'Door lock motor failed during self-clean cycle, latch mechanism jammed, or control board stuck in clean mode.' },
    ],
    [
      { icon: '&#127777;', title: 'Gas Oven Won\'t Ignite', desc: 'Weak igniter glow, failed gas safety valve, or clogged burner ports. Gas ignition requires certified technician diagnosis.' },
      { icon: '&#128269;', title: 'Temperature Way Off from Setting', desc: 'Thermostat sensor shifted position, calibration drift over years of use, or temperature probe wire damaged.' },
      { icon: '&#128308;', title: 'Loud Pop When Preheating', desc: 'Delayed gas ignition creating a small gas buildup, or electric element cracking from thermal stress. Both need inspection.' },
      { icon: '&#9889;', title: 'Touchpad Not Responding', desc: 'Membrane switch worn through, moisture behind the panel, or control board communication failure. We test and replace as needed.' },
      { icon: '&#128166;', title: 'Smoke During Normal Use', desc: 'Spilled food on element or burner, wiring insulation burning, or oven gasket deteriorating from heat exposure.' },
      { icon: '&#128683;', title: 'Light Burned Out Inside', desc: 'Specialty high-temperature bulb required, or socket corrosion preventing contact. We carry replacement bulbs and sockets.' },
    ],
    [
      { icon: '&#128269;', title: 'Takes Forever to Preheat', desc: 'Weak igniter drawing current but not reaching ignition temperature, hidden element degradation, or insulation loss around the cavity.' },
      { icon: '&#127777;', title: 'Broiler Element Not Working', desc: 'Upper element open-circuit, broiler relay on the control board failed, or selector switch not routing power to broil mode.' },
      { icon: '&#128308;', title: 'Convection Fan Noisy or Stopped', desc: 'Fan motor bearing worn, blade hitting the back panel, or motor winding burned out. Convection cooking requires even airflow.' },
      { icon: '&#9889;', title: 'F1 or F3 Fault Code', desc: 'F1 indicates control board failure; F3 indicates open or shorted oven temperature sensor. We test the sensor circuit and replace the failed part.' },
      { icon: '&#128683;', title: 'Hinges Broken — Door Drops', desc: 'Hinge springs snapped, hinge arm bent, or mounting bracket cracked. Door weight makes operation dangerous until repaired.' },
      { icon: '&#128166;', title: 'Steam or Moisture During Baking', desc: 'Door gasket not sealing, excessive moisture from food, or vent tube blocked. Some steam is normal — excessive indicates a seal issue.' },
    ],
    [
      { icon: '&#9889;', title: 'Clock and Timer Not Working', desc: 'Control board clock circuit failed, power surge damaged the display, or ribbon cable corroded. Timer function affects auto-cook features.' },
      { icon: '&#127777;', title: 'Only Top or Bottom Heats', desc: 'One element burned out while the other works. Bake uses the bottom element; broil uses the top. We test and replace the failed element.' },
      { icon: '&#128308;', title: 'Rattling Inside the Oven', desc: 'Loose heat shield, displaced baffle, or convection fan bracket vibrating. Internal components shift over thermal cycling.' },
      { icon: '&#128269;', title: 'Oven Overheats Beyond Setting', desc: 'Thermostat contacts stuck closed, control board relay welded, or runaway heating. Safety risk requiring immediate service.' },
      { icon: '&#128683;', title: 'Self-Clean Cycle Won\'t Start', desc: 'Door lock motor failure, thermal fuse blown from previous clean cycle, or control board not initiating the high-temperature sequence.' },
      { icon: '&#128166;', title: 'Gas Smell When Oven Is Off', desc: 'Gas valve not fully seating, connector fitting loose, or gas line issue. Turn off gas supply and call immediately.' },
    ],
    [
      { icon: '&#127777;', title: 'Element Glows But Oven Stays Cool', desc: 'Element partially burned through — still draws current and glows red but produces insufficient heat for cooking. Replacement needed.' },
      { icon: '&#128269;', title: 'Digital Display Shows Wrong Temp', desc: 'Temperature sensor resistance shifted, control board calibration lost, or sensor wire partially broken giving intermittent readings.' },
      { icon: '&#128308;', title: 'Buzzing from Control Panel', desc: 'Transformer hum, relay vibration, or failing capacitor on the control board. Electronic noise usually indicates a component nearing failure.' },
      { icon: '&#9889;', title: 'Oven Turns Off Mid-Cook', desc: 'Thermal overload tripping, intermittent igniter failure on gas models, or control board timeout error. Disrupts meal preparation.' },
      { icon: '&#128683;', title: 'Interior Light Stays On', desc: 'Door switch stuck, wiring short keeping light circuit energized, or control board light relay welded closed. Wastes energy and heats cavity.' },
      { icon: '&#128166;', title: 'Grease Dripping from Vent', desc: 'Vent duct accumulated grease from cooking fumes, or vent damper not closing fully allowing condensation and grease to flow back.' },
    ],
    [
      { icon: '&#128308;', title: 'Grinding When Convection Runs', desc: 'Convection fan motor bearings seizing, blade scraping the back wall, or motor shaft wobbling from wear.' },
      { icon: '&#127777;', title: 'Bottom Burns, Top Raw', desc: 'Bake element too hot or thermostat reading low, causing excessive bottom heat. Convection fan failure also eliminates heat distribution.' },
      { icon: '&#128269;', title: 'Won\'t Heat Past 200°F', desc: 'Igniter too weak to open gas valve, element half-burned, or thermostat limiting temperature range. Partial heating wastes time and gas.' },
      { icon: '&#9889;', title: 'Locked After Power Outage', desc: 'Self-clean lock engaged during power loss and control board cannot reset the latch. Manual override or board replacement required.' },
      { icon: '&#128683;', title: 'Oven Rack Stuck — Won\'t Slide', desc: 'Rack guides warped from self-clean heat, track rails bent, or roller wheels melted. We replace guides and racks as needed.' },
      { icon: '&#128166;', title: 'Moisture Between Glass Panels', desc: 'Door vent plugged with grease, outer glass seal failed, or inner glass cracked allowing steam between the panes.' },
    ],
    [
      { icon: '&#127777;', title: 'Pilot Light Keeps Going Out', desc: 'Thermocouple weak, pilot orifice clogged, or draft blowing out the flame. Thermocouple replacement is quick and inexpensive.' },
      { icon: '&#128308;', title: 'Banging When Door Closes', desc: 'Hinge slam from broken door spring or dampener, or loose inner panel. We adjust and replace springs to restore smooth closure.' },
      { icon: '&#128269;', title: 'Timer Beeps But Oven Won\'t Stop', desc: 'Relay on control board stuck in the on position, or timer motor disconnected from the control circuit. The oven ignores the end signal.' },
      { icon: '&#9889;', title: 'Preheats Then Shows Error', desc: 'Temperature sensor reads correctly at room temp but fails under heat — cracked ceramic insulation or wire break that opens at high temperature.' },
      { icon: '&#128683;', title: 'Oven Door Glass Cracked', desc: 'Inner or outer glass panel cracked from thermal shock or impact. We source replacement glass panels for all major oven brands.' },
      { icon: '&#128166;', title: 'Food Tastes Like Gas', desc: 'Incomplete combustion from clogged burner ports, low gas pressure, or flame not adjusted properly. Burner service resolves the issue.' },
    ],
    [
      { icon: '&#128269;', title: 'Won\'t Turn On At All', desc: 'Control board failure, blown thermal fuse, or power supply issue. We test the full electrical path from the breaker to the board.' },
      { icon: '&#127777;', title: 'Bake Element Visible Break', desc: 'The element has a visible crack, bubble, or burn-through. Even small breaks cause complete heat loss. Same-day element replacement.' },
      { icon: '&#128308;', title: 'Clicking Igniter — No Flame', desc: 'Igniter sparks but gas doesn\'t flow — safety valve not opening, gas supply issue, or igniter not reaching proper temperature.' },
      { icon: '&#9889;', title: 'E0 or E1 Error on Startup', desc: 'Electronic control board self-test failure at power-on. Board replacement or sensor recalibration needed before the oven will operate.' },
      { icon: '&#128683;', title: 'Warped Door — Gap Visible', desc: 'Heat damage to door frame, hinge mounting point shifted, or inner panel buckled. Hot air escapes and cooking is uneven.' },
      { icon: '&#128166;', title: 'Staining on Oven Ceiling', desc: 'Broil element splattering, vent redirecting grease, or previous spill carbonizing under heat. Professional cleaning and part check needed.' },
    ],
  ],
  // For stove-repair pages
  'stove': [
    [
      { icon: '&#127777;', title: 'Burner Won\'t Light or Heat', desc: 'Failed surface igniter, loose wire connection, or defective burner switch. We test the circuit and repair or replace the component.' },
      { icon: '&#128308;', title: 'Clicking Sound Won\'t Stop', desc: 'Moisture in the igniter switch, food debris bridging contacts, or spark module continuously firing. Cleaning or switch replacement resolves it.' },
      { icon: '&#9889;', title: 'One Element Works, Others Don\'t', desc: 'Individual element burnout, failed switch for that burner, or loose wire terminal. Each burner has its own circuit that we test independently.' },
      { icon: '&#128269;', title: 'Uneven Flame on Gas Burner', desc: 'Clogged burner ports, misaligned burner cap, or low gas pressure from a partially closed supply valve. We clean and adjust.' },
      { icon: '&#128683;', title: 'Knob Won\'t Turn or Is Loose', desc: 'Shaft stem broken, valve seized from grease buildup, or knob adapter cracked. We replace stems and knobs for all major brands.' },
      { icon: '&#128166;', title: 'Gas Smell When Burner Is Off', desc: 'Valve not seating fully, gas line connection loose, or burner cap not positioned correctly. Turn off gas and call immediately.' },
    ],
    [
      { icon: '&#128308;', title: 'Constant Ticking from Igniters', desc: 'Spark module sending continuous pulses — moisture ingress, food spillover on igniter, or faulty spark module. We diagnose and fix the cause.' },
      { icon: '&#127777;', title: 'Electric Element Stays on Low', desc: 'Infinite switch failed in low-heat position, or element internal resistance increased from age. Partial heating wastes energy.' },
      { icon: '&#128269;', title: 'Glass Top Cracked', desc: 'Impact damage, thermal shock from cold cookware on hot surface, or manufacturing defect. We source and install replacement glass tops.' },
      { icon: '&#9889;', title: 'Touch Controls Erratic', desc: 'Moisture under the glass surface, failed touch sensor, or control board communication error. We test each input zone independently.' },
      { icon: '&#128683;', title: 'Burner Grate Wobbles', desc: 'Cast iron grate foot broken, support worn down, or grate warped from heat. We carry replacement grates for standard sizes.' },
      { icon: '&#128166;', title: 'Drip Pan Overflow During Boilover', desc: 'Drip pan full of debris, drain channel blocked, or spill running under the cooktop. We clean the underside and clear drainage.' },
    ],
    [
      { icon: '&#127777;', title: 'Flame Burns Yellow Instead of Blue', desc: 'Incomplete combustion from clogged air shutter, dirty burner ports, or incorrect gas pressure. Yellow flame produces carbon monoxide.' },
      { icon: '&#128269;', title: 'Indicator Light Stays On', desc: 'Surface element switch stuck, residual heat sensor failure, or element cycling on and off too quickly.' },
      { icon: '&#128308;', title: 'Popping When Heating Up', desc: 'Thermal expansion of the glass top, coil element connection arcing, or loose hardware under the cooktop rattling during heat-up.' },
      { icon: '&#9889;', title: 'Induction Burner Shows Error', desc: 'Incompatible cookware, sensor coil failure, or power board overheating. Induction cooktops require specific diagnostic equipment.' },
      { icon: '&#128683;', title: 'One Burner Stuck On High', desc: 'Infinite switch contacts welded from surge, or valve stem seized in the open position. Safety hazard requiring immediate repair.' },
      { icon: '&#128166;', title: 'Condensation Under Glass Top', desc: 'Seal between glass and frame deteriorated, or spill seeped underneath. We reseal the glass and clean the underside.' },
    ],
    [
      { icon: '&#9889;', title: 'Digital Display Blank', desc: 'Clock board failure, ribbon cable disconnected, or power surge damaged the display module. Some stoves won\'t operate without a working clock.' },
      { icon: '&#127777;', title: 'Back Burners Weak, Front Normal', desc: 'Gas pressure drop across the manifold, rear burner orifices partially blocked, or valve not opening fully for back burner positions.' },
      { icon: '&#128308;', title: 'Buzzing from Induction Surface', desc: 'Normal operational hum amplified by lightweight cookware, or power board capacitor vibration. Some buzz is inherent to induction technology.' },
      { icon: '&#128269;', title: 'Cooktop Not Level', desc: 'Leveling legs adjusted incorrectly, floor under range uneven, or anti-tip bracket pulling one side down. Unlevel affects cooking and door alignment.' },
      { icon: '&#128683;', title: 'Oven Door Hinge on Range Broken', desc: 'Hinge spring snapped, arm bent, or bracket pulled from the frame. Range oven doors are heavy and hinge failure makes them dangerous.' },
      { icon: '&#128166;', title: 'Oil Splatter Under Burner Caps', desc: 'Accumulated cooking oil under the burner caps prevents proper flame pattern and can ignite. Deep cleaning under the cooktop surface restores safety.' },
    ],
    [
      { icon: '&#128269;', title: 'Cooktop Won\'t Turn On', desc: 'No power to any burner — check breaker, power cord, and terminal block. Gas models may have pilot or electronic ignition system failure.' },
      { icon: '&#128308;', title: 'Sizzling Sound from Burner', desc: 'Moisture under coil element, food debris on gas igniter, or element terminal corrosion causing arcing. Clean and inspect connections.' },
      { icon: '&#127777;', title: 'Gas Burner Flame Too High', desc: 'Gas regulator malfunction, incorrect orifice size for gas type (natural vs propane), or valve not regulating properly. Adjustment needed.' },
      { icon: '&#9889;', title: 'Timer Controls Lock Up', desc: 'Control board communication error, keypad membrane sticking, or moisture in the control housing. Reset or board replacement required.' },
      { icon: '&#128683;', title: 'Anti-Tip Bracket Missing', desc: 'Safety bracket prevents the range from tipping if weight is applied to an open oven door. Building code requires this on all freestanding ranges.' },
      { icon: '&#128166;', title: 'Spill Dripped Into Burner Box', desc: 'Liquid spill ran through burner opening into the wiring area below. We clean, dry, and inspect wiring for damage before restarting.' },
    ],
    [
      { icon: '&#127777;', title: 'Radiant Element Slow to Heat', desc: 'Element ribbon degrading, infinite switch not delivering full voltage, or glass cooktop coating reducing heat transfer efficiency.' },
      { icon: '&#128308;', title: 'Humming from Under Cooktop', desc: 'Induction power board fan, transformer vibration, or loose sheet metal panel. We isolate the vibration source and secure or replace.' },
      { icon: '&#128269;', title: 'Surface Element Glows Unevenly', desc: 'Partial element break — one section glows bright while another stays dark. Full element replacement restores even heat distribution.' },
      { icon: '&#9889;', title: 'Error After Power Outage', desc: 'Clock needs reset before oven functions, or power surge damaged the control board. Simple reset or board replacement resolves it.' },
      { icon: '&#128683;', title: 'Downdraft Vent Stuck Down', desc: 'Motor failure, linkage disconnected, or control switch not sending the raise signal. Downdraft systems have dedicated raise/lower motors.' },
      { icon: '&#128166;', title: 'Rust Spots on Drip Pans', desc: 'Chrome or porcelain coating worn through from repeated cleaning. Replace drip pans — rust can flake into heating elements.' },
    ],
    [
      { icon: '&#128269;', title: 'Only Two of Four Burners Work', desc: 'Independent circuits per burner pair — one leg of the 240V supply may be lost at the breaker, outlet, or terminal block.' },
      { icon: '&#127777;', title: 'Pilot Light Won\'t Stay Lit', desc: 'Thermocouple not in the flame path, weak thermocouple signal, or draft blowing out the pilot. Quick thermocouple replacement fixes it.' },
      { icon: '&#128308;', title: 'Rattling Inside Range Body', desc: 'Loose insulation, displaced heat shield, or oven fan bracket vibrating. We access the interior and secure all components.' },
      { icon: '&#9889;', title: 'Self-Clean Lock Engaged — Won\'t Open', desc: 'Lock motor failed mid-cycle, thermal fuse protecting the lock circuit blown, or control board stuck in clean mode.' },
      { icon: '&#128683;', title: 'Control Knob Gets Extremely Hot', desc: 'Heat traveling up the valve stem from the burner, missing stem gasket, or poor insulation around the manifold. Safety concern.' },
      { icon: '&#128166;', title: 'Water Under Range After Mopping', desc: 'Water seeped under the range during floor cleaning, pooling around gas connections or electrical terminals. Dry and inspect before using.' },
    ],
    [
      { icon: '&#128308;', title: 'Loud Click Then Nothing Happens', desc: 'Igniter fires but gas doesn\'t flow — safety valve not receiving enough current from a weak igniter. Igniter replacement needed.' },
      { icon: '&#127777;', title: 'Small Burner Adequate, Large Burner Weak', desc: 'Large burner orifice partially clogged, or gas manifold pressure not reaching all burner positions equally. Professional cleaning and adjustment.' },
      { icon: '&#128269;', title: 'Glass Cooktop Scratched', desc: 'Rough-bottom cookware, abrasive cleaning, or dragging pots across the surface. Deep scratches weaken the glass structurally.' },
      { icon: '&#9889;', title: 'Won\'t Convert from Natural Gas to Propane', desc: 'Conversion requires orifice change, regulator adjustment, and air shutter modification. Factory conversion kits are brand-specific.' },
      { icon: '&#128683;', title: 'Oven on Range Works, Cooktop Doesn\'t', desc: 'Separate circuits or gas paths for cooktop vs oven. Cooktop-specific switch, valve, or wiring failure while oven continues normally.' },
      { icon: '&#128166;', title: 'Grease Fire Risk from Buildup', desc: 'Accumulated grease under burners, on drip pans, and in the oven cavity. Professional deep cleaning reduces fire risk significantly.' },
    ],
  ],
};

// ═══════════════════════════════════════════════════════════════════
// MAIN PROCESSING
// ═══════════════════════════════════════════════════════════════════

function getServiceType(filename) {
  const base = filename.replace('.html', '');
  if (base.includes('washer-repair') && !base.includes('dishwasher')) return 'washer';
  if (base.includes('dishwasher-repair') || base.includes('dishwasher-installation')) return 'dishwasher';
  if (base.includes('dryer-repair')) return 'dryer';
  if (base.includes('fridge-repair')) return 'fridge';
  if (base.includes('oven-repair')) return 'oven';
  if (base.includes('stove-repair')) return 'stove';
  return null;
}

function extractCity(filename) {
  const base = filename.replace('.html', '');
  // Remove service prefix to get city slug
  const prefixes = [
    'dishwasher-installation-', 'dishwasher-repair-', 'washer-repair-',
    'dryer-repair-', 'fridge-repair-', 'oven-repair-', 'stove-repair-',
    'gas-stove-repair-', 'gas-oven-repair-', 'gas-dryer-repair-',
    'gas-appliance-repair-', 'bosch-repair-', 'samsung-repair-',
    'lg-repair-', 'whirlpool-repair-', 'frigidaire-repair-',
    'ge-repair-', 'kitchenaid-repair-', 'maytag-repair-',
    'miele-repair-', 'kenmore-repair-', 'electrolux-repair-',
    'freezer-repair-', 'microwave-repair-', 'range-repair-'
  ];
  for (const prefix of prefixes) {
    if (base.startsWith(prefix)) {
      return base.slice(prefix.length);
    }
  }
  return null;
}

function buildProblemsGrid(cards) {
  const delays = ['', ' style="transition-delay:.05s"', ' style="transition-delay:.10s"', ' style="transition-delay:.15s"', ' style="transition-delay:.20s"', ' style="transition-delay:.25s"'];
  return cards.map((c, i) => {
    return `      <div class="problem-card reveal"${delays[i] || ''}>
        <span class="problem-icon">${c.icon}</span>
        <div class="problem-title">${c.title}</div>
        <p class="problem-desc">${c.desc}</p>
      </div>`;
  }).join('\n');
}

function replaceProblemsGrid(html, serviceType, city) {
  const sets = problemCardSets[serviceType];
  if (!sets) return html;

  const varIdx = hashCity(city, sets.length);
  const cards = sets[varIdx];
  const newGrid = buildProblemsGrid(cards);

  // Match the problems-grid div and its contents
  const gridRegex = /(<div class="problems-grid">)\s*([\s\S]*?)(\s*<\/div>\s*<\/div>\s*<\/section>)/;
  const match = html.match(gridRegex);
  if (!match) return html;

  // Only replace the inner cards, keep the wrapping div
  return html.replace(gridRegex, `$1\n${newGrid}\n    $3`);
}

// ═══════════════════════════════════════════════════════════════════
// PRICING VARIATIONS
// ═══════════════════════════════════════════════════════════════════
const pricingNotes = [
  'Final price confirmed in writing before any work begins. No hidden fees. 90-day parts &amp; labour warranty on all repairs.',
  'We quote the exact cost before touching a single part. You approve it or pay only the diagnostic fee. 90-day warranty included.',
  'Every repair quote is in writing before we begin. No surprises on your bill. All work carries our 90-day parts and labour guarantee.',
  'Transparent pricing with no hidden charges. Written quote provided upfront — you decide whether to proceed. Full 90-day warranty.',
  'You get a firm written price before we start. If you choose not to proceed, you pay only the diagnostic visit fee. 90-day warranty standard.',
  'Our upfront pricing means no bill shock. Written quote before any work, 90-day warranty after. Fair pricing, honest service.',
  'Price is locked in writing before repair begins. Diagnostic fee waived when you proceed with the fix. Full 90-day parts and labour warranty.',
  'What we quote is what you pay — confirmed in writing before we pick up a wrench. Every repair backed by our 90-day guarantee.',
];

const pricingSubtitles = [
  'Transparent, upfront pricing — no surprises. We quote before we fix, always.',
  'Honest pricing with no hidden charges. Every repair quoted in writing before we start.',
  'Clear pricing from the start. You approve the cost before any work begins.',
  'What you see is what you pay. Written quotes, no surprise fees, no pressure.',
  'Fair, upfront pricing that respects your budget. Quote first, fix second — always.',
  'No guesswork on cost. We provide a written quote and you make the call.',
  'Straightforward pricing with no add-ons. Written estimate before every repair.',
  'Budget-friendly transparency. You know the price before we touch a single part.',
];

function replacePricingNote(html, city) {
  const idx = hashCity2(city, pricingNotes.length);
  const oldNote = /(<p class="pricing-note">)[^<]*(<\/p>)/;
  if (oldNote.test(html)) {
    html = html.replace(oldNote, `$1${pricingNotes[idx]}$2`);
  }
  return html;
}

function replacePricingSubtitle(html, city) {
  const idx = hashCity3(city, pricingSubtitles.length);
  // Match pricing section subtitle
  const subtitleRegex = /(class="section-subtitle">)(Transparent, upfront pricing[^<]*|Honest pricing[^<]*|Clear pricing[^<]*|What you see[^<]*|Fair, upfront[^<]*|No guesswork[^<]*|Straightforward pricing[^<]*|Budget-friendly[^<]*)(<\/p>)/;
  if (subtitleRegex.test(html)) {
    html = html.replace(subtitleRegex, `$1${pricingSubtitles[idx]}$3`);
  }
  return html;
}

// ═══════════════════════════════════════════════════════════════════
// SECTION SUBTITLE VARIATIONS (problems section)
// ═══════════════════════════════════════════════════════════════════
const problemSubtitles = [
  'Our technicians are equipped to diagnose and repair the most common issues on the first visit.',
  'Most problems are diagnosed and fixed during the first visit — no waiting for parts or second appointments.',
  'Same-day diagnosis and repair for the issues below. We arrive with parts ready to fix it right.',
  'We bring the right tools and parts to handle these common problems on our first visit to your home.',
  'Every issue below is one we resolve regularly. Our technicians carry the parts needed for immediate repair.',
  'Experienced with all the issues listed below. First-visit completion rate exceeds 90% across all brands.',
  'These are the faults we see and fix every week. Diagnosis is fast because we know exactly what to look for.',
  'From simple fixes to complex repairs, we handle every issue below with same-day parts and expert diagnosis.',
];

function replaceProblemSubtitle(html, city) {
  const idx = hashCity2(city, problemSubtitles.length);
  const regex = /(class="section-subtitle">)(Our technicians are equipped[^<]*|Most problems are diagnosed[^<]*|Same-day diagnosis[^<]*|We bring the right[^<]*|Every issue below[^<]*|Experienced with all[^<]*|These are the faults[^<]*|From simple fixes[^<]*)(<\/p>)/;
  if (regex.test(html)) {
    html = html.replace(regex, `$1${problemSubtitles[idx]}$3`);
  }
  return html;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
function main() {
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const serviceType = getServiceType(file);
    const city = extractCity(file);
    if (!serviceType || !city) {
      skipped++;
      continue;
    }

    // Skip "near-me" pages
    if (city === 'near-me') { skipped++; continue; }

    const filePath = path.join(ROOT, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    const original = html;

    // 1. Replace problems grid cards with city-specific variation
    html = replaceProblemsGrid(html, serviceType, city);

    // 2. Replace pricing note text
    html = replacePricingNote(html, city);

    // 3. Replace pricing subtitle
    html = replacePricingSubtitle(html, city);

    // 4. Replace problem section subtitle
    html = replaceProblemSubtitle(html, city);

    if (html !== original) {
      fs.writeFileSync(filePath, html, 'utf-8');
      updated++;
      console.log(`  + ${file}`);
    } else {
      skipped++;
    }
  }

  console.log(`\n========================================`);
  console.log(`NEARY Section Variation Complete`);
  console.log(`========================================`);
  console.log(`Updated:  ${updated} pages`);
  console.log(`Skipped:  ${skipped} pages`);
  console.log(`Total:    ${files.length}`);
}

main();
