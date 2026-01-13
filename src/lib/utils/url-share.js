/**
 * URL sharing utilities - encode/decode calculator state in URL
 */

import { compress, decompress } from 'lz-string'

/**
 * Encode calculator state to URL-safe string
 */
export function encodeStateToURL(state) {
  try {
    // Create a simplified version of state for URL
    const shareableState = {
      company: state.company,
      founders: state.founders,
      rounds: state.rounds,
      employees: state.employees,
      optionPool: state.optionPool,
      scenarios: state.scenarios,
    }

    // Convert to JSON and compress
    const json = JSON.stringify(shareableState)
    const compressed = compress(json)

    // Encode to base64 URL-safe
    const encoded = btoa(compressed).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

    return encoded
  } catch (error) {
    console.error('Error encoding state:', error)
    throw new Error('Failed to create shareable link')
  }
}

/**
 * Decode URL string back to calculator state
 */
export function decodeStateFromURL(encoded) {
  try {
    // Decode from base64 URL-safe
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')

    // Add padding if needed
    const padded = base64 + '==='.slice(0, (4 - (base64.length % 4)) % 4)

    // Decompress and parse
    const compressed = atob(padded)
    const json = decompress(compressed)

    if (!json) {
      throw new Error('Invalid data')
    }

    return JSON.parse(json)
  } catch (error) {
    console.error('Error decoding state:', error)
    throw new Error('Invalid share link')
  }
}

/**
 * Generate shareable URL for current state
 */
export function generateShareURL(state) {
  try {
    const encoded = encodeStateToURL(state)
    const baseURL = window.location.origin
    return `${baseURL}/calculator?share=${encoded}`
  } catch (error) {
    console.error('Error generating share URL:', error)
    throw error
  }
}

/**
 * Check if current URL has shared state
 */
export function hasSharedState() {
  const params = new URLSearchParams(window.location.search)
  return params.has('share')
}

/**
 * Load shared state from URL if present
 */
export function loadSharedState() {
  try {
    const params = new URLSearchParams(window.location.search)
    const shareParam = params.get('share')

    if (!shareParam) {
      return null
    }

    return decodeStateFromURL(shareParam)
  } catch (error) {
    console.error('Error loading shared state:', error)
    return null
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)

      return successful
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    throw new Error('Failed to copy to clipboard')
  }
}
