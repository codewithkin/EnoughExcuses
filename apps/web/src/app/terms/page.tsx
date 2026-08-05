import type { Metadata } from "next";

import { LegalPage, List, Section } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service — ExcuseLess",
  description: "The terms you agree to when you use ExcuseLess.",
};

const CONTACT = "kinzinzombe07@gmail.com";

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" effectiveDate="5 August 2026">
      <Section title="Agreement">
        <p>
          These terms apply when you download or use ExcuseLess (the &quot;app&quot;). If you
          don&apos;t agree with them, don&apos;t use the app. If you do use it, you&apos;re agreeing
          to what&apos;s below.
        </p>
      </Section>

      <Section title="What ExcuseLess is">
        <p>
          ExcuseLess is a personal focus and task-tracking app. You create goals, break them into
          tasks, run a timer, and build a streak. It runs entirely on your device — there&apos;s no
          account to create and no server holding your content.
        </p>
        <p>
          It is a productivity tool, nothing more. It is not medical, psychological, financial, or
          professional advice, and it isn&apos;t a treatment for any condition.
        </p>
      </Section>

      <Section title="Your responsibilities">
        <List
          items={[
            "Use the app lawfully, and don't use it to do anything illegal",
            "Don't reverse-engineer, decompile, or attempt to extract the app's source code",
            "Don't redistribute, resell, or sublicense the app",
            "Don't attempt to circumvent purchase verification or unlock paid features without paying",
          ]}
        />
      </Section>

      <Section title="Your content is yours">
        <p>
          Everything you type into ExcuseLess — your goals, tasks, and notes — belongs to you. It
          stays on your device. We claim no ownership of it and, as explained in the{" "}
          <a href="/privacy" className="text-green hover:text-green-bright">
            Privacy Policy
          </a>
          , we never receive it.
        </p>
        <p>
          Because it lives only on your device, you are solely responsible for it. If you lose your
          device, uninstall the app, or clear its data, that content is gone permanently and we
          cannot recover it for you.
        </p>
      </Section>

      <Section title="Purchases">
        <p>
          ExcuseLess is free to download and the core loop — goals, tasks, the timer, streaks, and
          your daily summary — is free to use. Some features may be offered as a paid one-time
          purchase.
        </p>
        <p>
          All payments are processed by Google Play or the Apple App Store, not by us. Pricing and
          currency are shown at the point of purchase and are set through those stores.
        </p>
        <p>
          Refunds are handled entirely by whichever store you purchased through, under that
          store&apos;s refund policy. We cannot issue refunds directly. Google Play and Apple each
          publish their own refund windows and processes — contact them for any refund request.
        </p>
      </Section>

      <Section title="Availability and changes">
        <p>
          We may update, change, or discontinue features at any time. We may also deliver bug fixes
          and improvements over the air. We try to keep the app working well, but we don&apos;t
          guarantee it will always be available, uninterrupted, or error-free.
        </p>
      </Section>

      <Section title="Disclaimer and liability">
        <p>
          The app is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of
          any kind, whether express or implied, to the fullest extent permitted by law.
        </p>
        <p>
          To the fullest extent permitted by law, we are not liable for any indirect, incidental, or
          consequential damages arising from your use of the app — including lost data, lost
          productivity, or missed commitments. Where liability cannot be excluded, it is limited to
          the amount you actually paid for the app in the twelve months before the claim.
        </p>
        <p>
          Nothing in these terms limits any rights you have under mandatory consumer protection law
          in your country.
        </p>
      </Section>

      <Section title="Termination">
        <p>
          You can stop using ExcuseLess at any time by uninstalling it. We may suspend access if you
          materially breach these terms — for example by attempting to bypass purchase verification.
        </p>
      </Section>

      <Section title="Governing law">
        <p>
          These terms are governed by the laws of Zimbabwe. Any dispute will be subject to the
          courts of Zimbabwe, except where mandatory law in your country of residence gives you the
          right to bring proceedings locally.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may revise these terms from time to time. The effective date at the top will change
          when we do. Continuing to use the app after an update means you accept the revised terms.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${CONTACT}`} className="text-green hover:text-green-bright">
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
