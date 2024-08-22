import { post } from '~/lib/fetchWrapper'
import { API_URL, IS_PROD, IS_PREVIEW } from 'lib/constants'
import { NextRouter } from 'next/router'
import { useConsent } from 'ui-patterns'

export interface TelemetryEvent {
  category: string
  action: string
  label: string
  value?: string
}

export interface TelemetryProps {
  screenResolution?: string
  language: string
}

const noop = () => {}

// This event is the same as in studio/lib/telemetry.tx
// but uses different ENV variables for www

const sendEvent = (event: TelemetryEvent, gaProps: TelemetryProps, router: NextRouter) => {
  const { hasAcceptedConsent } = useConsent()
  if ((!IS_PROD && !IS_PREVIEW) || !hasAcceptedConsent) return noop

  const { category, action, label, value } = event

  return post(`${API_URL}/telemetry/event`, {
    action: action,
    category: category,
    label: label,
    value: value,
    page_referrer: document?.referrer,
    page_title: document?.title,
    page_location: router.asPath,
    ga: {
      screen_resolution: gaProps?.screenResolution,
      language: gaProps?.language,
    },
  })
}

export default {
  sendEvent,
}
