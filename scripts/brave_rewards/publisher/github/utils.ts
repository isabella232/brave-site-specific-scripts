/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as types from './types'

export const buildMediaKey = (mediaId: string) => {
  if (!mediaId) {
    return ''
  }

  return `${types.mediaType}_${mediaId}`
}

export const buildPublisherKey = (key: string) => {
  if (!key) {
    return ''
  }

  return `${types.mediaType}#channel:${key}`
}

export const buildProfileUrl = (screenName: string) => {
  if (!screenName) {
    return ''
  }

  return `https://github.com/${screenName}/`
}

export const buildProfileApiUrl = (screenName: string) => {
  if (!screenName) {
    return ''
  }

  return `https://api.github.com/users/${screenName}`
}

export const getScreenNameFromUrl = (url: URL) => {
  if (!url.pathname) {
    return ''
  }

  const pathComponents = url.pathname.split('/').filter(item => item)
  if (!pathComponents || pathComponents.length === 0) {
    return ''
  }

  if (pathComponents.length > 1 && pathComponents[0] === 'orgs') {
    return pathComponents[1]
  }

  return pathComponents[0]
}

export const isExcludedPath = (path: string) => {
  const paths = [
    '/',
    '/about',
    '/enterprise',
    '/events',
    '/explore',
    '/home',
    '/issues',
    '/login',
    '/logout',
    '/marketplace',
    '/nonprofit',
    '/notifications',
    '/pricing',
    '/pulls',
    '/search',
    '/settings',
    '/team',
    '/tos'
  ]

  if (paths.includes(path)) {
    return true
  }

  return false
}

export const isBlocklistedTab = (queryString: string) => {
  if (!queryString) {
    return false
  }

  const blocklist = [ 'repositories' ]

  const match = queryString.match('[\?|&]tab=([^&]+)&?')
  if (!match || match.length < 2 || !match[1]) {
    return false
  }

  const tab = match[1]
  if (!blocklist.includes(tab)) {
    return false
  }

  return true
}

export const getMediaMetaData = async (screenName: string) => {
  if (!screenName) {
    throw new Error('Invalid parameters')
  }

  const profileApiUrl = buildProfileApiUrl(screenName)
  if (!profileApiUrl) {
    throw new Error('Invalid profile api url')
  }

  const response = await fetch(profileApiUrl)
  if (!response.ok) {
    throw new Error(`Profile API request failed: ${response.statusText} (${response.status})`)
  }

  const data = await response.json()
  return {
    user: {
      id: data.id,
      screenName: data.login,
      fullName: data.name || data.login,
      favIconUrl: data.avatar_url
    },
    post: {
      id: '',
      timestamp: '',
      text: ''
    }
  }
}
