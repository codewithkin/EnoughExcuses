import type { Metadata } from "next";

import { LegalPage, List, Section } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — ExcuseLess",
  description:
    "How ExcuseLess handles your data. Short version: your tasks, goals, and streaks stay on your device.",
};

const CONTACT = "kinzinzombe07@gmail.com";

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="5 August 2026">
      <Section title="The short version">
        <p>
          ExcuseLess has no accounts and no server storing your content. Every goal, task, streak,
          and setting you create stays in encrypted storage on your own device. We can&apos;t read
          it, we don&apos;t back it up, and we never sell it. If you uninstall the app, it&apos;s
          gone.
        </p>
        <p>
          The rest of this page explains the two narrow exceptions — anonymous app diagnostics and
          over-the-air updates — in plain terms.
        </p>
      </Section>

      <Section title="What stays on your device">
        <p>
          The following is written to your device&apos;s secure storage and never transmitted to us
          or anyone else:
        </p>
        <List
          items={[
            "Your goals and tasks, including titles and durations you type in",
            "Focus session history, streak count, and daily summaries",
            "Onboarding answers (the focus areas you picked and your stated reason)",
            "App preferences such as timer style and notification toggles",
          ]}
        />
        <p>
          Home screen widgets and the iOS Live Activity read this same on-device data so they can
          show your current task and timer. That data stays within the app&apos;s own private
          storage on your device.
        </p>
      </Section>

      <Section title="What leaves your device">
        <p>
          Two services receive limited information. Neither of them receives your task or goal
          content.
        </p>
        <p className="text-fg">Expo Insights (analytics)</p>
        <p>
          We use Expo Insights to understand basic app health — how many people open the app, which
          app version they&apos;re on, and whether it&apos;s crashing. This is anonymous and
          aggregated. It includes technical details like device model, operating system version, and
          app version. It does not include your name, email, or anything you typed into the app.
        </p>
        <p className="text-fg">Expo Updates (over-the-air updates)</p>
        <p>
          The app can download bug fixes without a full store update. To check whether an update
          applies to your device, it sends your app version and platform to Expo&apos;s servers.
        </p>
        <p className="text-fg">Payments</p>
        <p>
          The current version of ExcuseLess is free and contains no in-app purchases, so no payment
          data is collected or processed at all. If we introduce paid features in a future version,
          payments would be handled by Google Play or the Apple App Store — we would never see or
          store your card details — and this policy will be updated before that goes live.
        </p>
      </Section>

      <Section title="What we never do">
        <List
          items={[
            "We don't require an account, email address, or phone number",
            "We don't show ads or share data with advertisers",
            "We don't sell or rent personal information to anyone",
            "We don't track you across other apps or websites",
            "We don't access your contacts, camera, photos, or location",
          ]}
        />
      </Section>

      <Section title="Permissions the app requests">
        <p>
          <span className="text-fg">Notifications.</span> Used only to send reminders you&apos;ve
          turned on — timer completion, a daily nudge, and streak warnings. These are generated on
          your device. There is no push server, and declining this permission doesn&apos;t limit any
          other feature.
        </p>
      </Section>

      <Section title="Deleting your data">
        <p>
          Because everything lives on your device, you are always in full control. You can clear all
          app data from within Settings in the app, or simply uninstall ExcuseLess — either action
          permanently removes your goals, tasks, history, and streaks. There is no server-side copy
          for us to delete, and no account to close.
        </p>
        <p>
          Since the app is currently free with no purchases, there are no billing records associated
          with you either.
        </p>
      </Section>

      <Section title="Children">
        <p>
          ExcuseLess is not directed at children under 13, and we do not knowingly collect personal
          information from them. Since the app collects no personal information from anyone, this is
          largely moot — but if you believe a child has provided information through a third-party
          service we use, contact us and we&apos;ll help address it.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If we ever start handling data differently, we&apos;ll update this page and change the
          effective date at the top. Material changes will also be noted in the app or its store
          listing.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about privacy, or want to know exactly what we hold on you? Email{" "}
          <a href={`mailto:${CONTACT}`} className="text-green hover:text-green-bright">
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
