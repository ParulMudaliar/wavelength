<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for the Wavelength React/Vite application. PostHog (`posthog-js` v1.386.6, already installed) is now initialized in `src/main.jsx` using environment variables from `.env.local`. Event tracking has been added to `src/App.jsx` for all major user interactions: counter button clicks, documentation link clicks, and community/social link clicks.

| Event Name | Description | File |
|---|---|---|
| `counter_incremented` | User clicked the counter button, incrementing the count | `src/App.jsx` |
| `documentation_link_clicked` | User clicked a documentation link (Vite or React) | `src/App.jsx` |
| `community_link_clicked` | User clicked a community/social link (GitHub, Discord, X, Bluesky) | `src/App.jsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/469170/dashboard/1709298)
- [Counter increments over time](https://us.posthog.com/project/469170/insights/guREJkrX)
- [Total interactions (30d)](https://us.posthog.com/project/469170/insights/ODw27RMH)
- [Link clicks: documentation vs community](https://us.posthog.com/project/469170/insights/JlcEOPQZ)
- [Unique active users per day](https://us.posthog.com/project/469170/insights/rmliPZeq)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
