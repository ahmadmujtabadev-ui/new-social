import React, { useState } from "react";

type TermsCheckboxWithModalProps = {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
};

export const TermsCheckboxWithModal: React.FC<TermsCheckboxWithModalProps> = ({
  checked,
  error,
  onChange,
}) => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <div className="flex items-start gap-3 p-5 bg-black rounded-xl border-2 border-[#f0b400] mb-2">
        <input
          type="checkbox"
          name="terms"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 accent-[#f0b400]"
        />
        <span className="text-sm text-[#f0b400] leading-relaxed">
          I confirm the details are accurate and agree to the{" "}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="underline text-white hover:text-[#f0b400] transition"
          >
            Terms &amp; Conditions
          </button>
          .
        </span>
      </div>

      {error && (
        <p className="text-red-500 text-xs font-semibold mt-1.5">{error}</p>
      )}

      {showTerms && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border-2 border-[#f0b400] rounded-xl w-11/12 md:w-2/3 max-h-[80vh] overflow-y-auto p-6 shadow-xl relative">
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="absolute top-3 right-3 text-[#f0b400] text-xl font-bold hover:text-white transition"
            >
              ×
            </button>

            <h2 className="text-[#f0b400] text-2xl font-bold mb-4 text-center">
              Terms &amp; Conditions
            </h2>

            <div className="text-white text-sm space-y-4 leading-relaxed">
              <section>
                <p className="font-semibold text-[#f0b400]">
                  1. Event Participation
                </p>
                <ul className="list-disc ml-5">
                  <li>
                    Participation is confirmed only once full payment has been
                    received.
                  </li>
                  <li>
                    Booth assignments are determined by the organizers and may
                    not be changed without approval.
                  </li>
                  <li>
                    All sponsors and vendors agree to conduct themselves in a
                    professional and respectful manner.
                  </li>
                </ul>
              </section>

              <section>
                <p className="font-semibold text-[#f0b400]">
                  2. Setup &amp; Take-Down
                </p>
                <ul className="list-disc ml-5">
                  <li>
                    Vendors must arrive during the designated setup time and not
                    pack up before the event ends.
                  </li>
                  <li>
                    All display materials must stay within the assigned booth
                    space.
                  </li>
                  <li>
                    Vendors are responsible for keeping their area clean and
                    tidy.
                  </li>
                </ul>
              </section>

              <section>
                <p className="font-semibold text-[#f0b400]">
                  3. Products &amp; Services
                </p>
                <ul className="list-disc ml-5">
                  <li>
                    All products and services must be legal and appropriate for
                    a family-friendly community event.
                  </li>
                  <li>
                    Food vendors must follow local health and food-safety
                    regulations.
                  </li>
                  <li>
                    Any prohibited or unsafe items may be removed at the
                    organizers’ discretion.
                  </li>
                </ul>
              </section>

              <section>
                <p className="font-semibold text-[#f0b400]">
                  4. Marketing &amp; Branding
                </p>
                <ul className="list-disc ml-5">
                  <li>
                    Sponsors grant organizers permission to use their business
                    name, logo, and promotional materials in event marketing.
                  </li>
                  <li>
                    Vendors may promote their products/services within their
                    booth area only.
                  </li>
                  <li>
                    Sponsor benefits (posts, shout-outs, logos, etc.) are
                    delivered according to the selected sponsorship tier.
                  </li>
                </ul>
              </section>

              <section>
                <p className="font-semibold text-[#f0b400]">
                  5. Banner &amp; Display Materials
                </p>
                <ul className="list-disc ml-5">
                  <li>
                    Platinum sponsors may display a banner at the event entrance
                    (banner must be provided by the sponsor).
                  </li>
                  <li>
                    Displays must not damage venue walls, furniture, or
                    property.
                  </li>
                </ul>
              </section>

              <section>
                <p className="font-semibold text-[#f0b400]">6. Liability</p>
                <ul className="list-disc ml-5">
                  <li>
                    Participation is at the sponsor’s or vendor’s own risk.
                  </li>
                  <li>
                    Organizers are not responsible for loss, theft, or damage to
                    personal or business property.
                  </li>
                  <li>
                    Vendors are encouraged to carry their own insurance if
                    needed.
                  </li>
                </ul>
              </section>

              <section>
                <p className="font-semibold text-[#f0b400]">
                  7. Payment &amp; Refunds
                </p>
                <ul className="list-disc ml-5">
                  <li>
                    Payments are generally non-refundable unless the event is
                    cancelled by the organizers.
                  </li>
                  <li>
                    If an event is postponed, sponsorships/booths will normally
                    be transferred to the new date.
                  </li>
                </ul>
              </section>

              <section>
                <p className="font-semibold text-[#f0b400]">
                  8. Communication &amp; Contact
                </p>
                <ul className="list-disc ml-5">
                  <li>
                    By registering, you agree to receive event-related updates
                    and future opportunities from the organizers.
                  </li>
                  <li>
                    You can request to be removed from mailing lists at any
                    time.
                  </li>
                </ul>
              </section>

              <section>
                <p className="font-semibold text-[#f0b400]">
                  9. Code of Conduct
                </p>
                <ul className="list-disc ml-5">
                  <li>
                    Harassment, hate speech, or disruptive behaviour will not be
                    tolerated.
                  </li>
                  <li>
                    Organizers may remove any participant who violates these
                    terms without refund.
                  </li>
                </ul>
              </section>

              <p className="text-xs text-gray-400 mt-4">
                By submitting this form, you confirm that you have read,
                understood, and agree to these Terms &amp; Conditions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="mt-6 w-full bg-[#f0b400] text-black font-bold py-3 rounded-lg hover:bg-[#d9a800] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
