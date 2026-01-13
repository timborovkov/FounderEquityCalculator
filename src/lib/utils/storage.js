/**
 * Storage utilities for manual save/load functionality
 */

const STORAGE_KEY_PREFIX = 'equity-calculator-save-'
const SAVES_LIST_KEY = 'equity-calculator-saves'

/**
 * Get list of all saved sessions
 */
export function getSavedSessions() {
  try {
    const savesData = localStorage.getItem(SAVES_LIST_KEY)
    return savesData ? JSON.parse(savesData) : []
  } catch (error) {
    console.error('Error loading saved sessions:', error)
    return []
  }
}

/**
 * Save current state with a custom name
 */
export function saveSession(name, data) {
  try {
    const id = crypto.randomUUID()
    const timestamp = new Date().toISOString()

    const saveMetadata = {
      id,
      name,
      timestamp,
      preview: generatePreview(data),
    }

    // Save the actual data
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, JSON.stringify(data))

    // Update saves list
    const saves = getSavedSessions()
    saves.push(saveMetadata)
    localStorage.setItem(SAVES_LIST_KEY, JSON.stringify(saves))

    return saveMetadata
  } catch (error) {
    console.error('Error saving session:', error)
    throw error
  }
}

/**
 * Load a saved session by ID
 */
export function loadSession(id) {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`)
    if (!data) {
      throw new Error('Save not found')
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading session:', error)
    throw error
  }
}

/**
 * Delete a saved session
 */
export function deleteSession(id) {
  try {
    // Remove the data
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`)

    // Update saves list
    const saves = getSavedSessions()
    const filtered = saves.filter(save => save.id !== id)
    localStorage.setItem(SAVES_LIST_KEY, JSON.stringify(filtered))

    return true
  } catch (error) {
    console.error('Error deleting session:', error)
    throw error
  }
}

/**
 * Update a saved session's name
 */
export function renameSession(id, newName) {
  try {
    const saves = getSavedSessions()
    const save = saves.find(s => s.id === id)
    if (!save) {
      throw new Error('Save not found')
    }

    save.name = newName
    localStorage.setItem(SAVES_LIST_KEY, JSON.stringify(saves))

    return true
  } catch (error) {
    console.error('Error renaming session:', error)
    throw error
  }
}

/**
 * Generate a preview summary of the save data
 */
function generatePreview(data) {
  return {
    companyName: data.company?.name || 'Unnamed Company',
    foundersCount: data.founders?.length || 0,
    roundsCount: data.rounds?.length || 0,
    employeesCount: data.employees?.length || 0,
  }
}

/**
 * Export all data as JSON file
 */
export function exportToJSON(data, filename = 'equity-calculator-export.json') {
  try {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()

    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('Error exporting JSON:', error)
    throw error
  }
}

/**
 * Import data from JSON file
 */
export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    reader.readAsText(file)
  })
}
