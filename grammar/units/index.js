/**
 * @file Barrel for dose-unit vocabulary, grouped by measurement kind.
 *
 * Split allows downstream tooling to distinguish continuous quantities
 * (mass, volume) from discrete counts (countable) and biological potency
 * (activity). A linter could, for example, warn when `%` appears on a
 * tablet prescription.
 * @license MIT
 */

import { ACTIVITY } from "./activity.js";
import { COUNTABLE } from "./countable.js";
import { MASS } from "./mass.js";
import { VOLUME } from "./volume.js";

export { ACTIVITY, COUNTABLE, MASS, VOLUME };

/** @type {readonly string[]} */
export const UNITS = [
	...MASS,
	...VOLUME,
	...ACTIVITY,
	...COUNTABLE,
];
