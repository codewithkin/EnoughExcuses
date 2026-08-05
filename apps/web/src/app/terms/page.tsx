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

      <Section title="Pricing and future paid features">
        <p>
          The current version of ExcuseLess is free. There are no in-app purchases, no subscriptions,
          and no paid tier — every feature in the app today is available to you at no cost.
        </p>
        <p>
          We may introduce paid features in a future version, which could take the form of a one-time
          purchase, a subscription, or both. If that happens, pricing will be shown clearly before
          you buy anything, and you will never be charged without explicitly confirming the purchase.
          Features that are free in the current version will not be taken away and put behind a
          paywall for existing users.
        </p>
        <p>
          Should paid features be introduced, all payments would be processed by Google Play or the
          Apple App Store rather than by us, and refunds would be handled entirely by whichever store
          you purchased through, under that store&apos;s own refund policy. We would not be able to
          issue refunds directly. These terms will be updated with full payment details before any
          paid feature goes live.
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
          the amount you actually paid for the app in the twelve months before the claim, which for
          the current free version is zero.
        </p>
        <p>
          Nothing in these terms limits any rights you have under mandatory consumer protection law
          in your country.
        </p>
      </Section>

      <Section title="Termination">
        <p>
          You can stop using ExcuseLess at any time by uninstalling it. We may suspend access if you
          materially breach these terms.
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
