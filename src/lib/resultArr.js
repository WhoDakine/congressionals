import { writable } from "svelte/store";

export const resultArr = writable([])
export const trailResult = writable([])
export const beachResult = writable([])
export const shouldTrail = writable(false)