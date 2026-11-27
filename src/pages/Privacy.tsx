import { PageMeta, PageHero } from "../components/ui";
export default function Privacy() {
  return (
    <>
      <PageMeta
        title="Privacy"
        description="How enquiry details and local orientation progress are handled on the Menengai club website."
      />
      <PageHero eyebrow="Privacy" title="Your details, handled plainly." />
      <section className="section">
        <div className="container article-body">
          <h2>Enquiries</h2>
          <p>
            The email-draft form keeps your name, reply details and message in
            this page’s memory. It does not save them in browser storage.
            Opening an email draft passes those details to your email app; you
            decide whether to send. Sending through your email app is subject to
            your email provider’s privacy terms.
          </p>
          <p>
            When you submit the contact form, your name, reply details, enquiry
            topic and message are stored in the club’s database so a verified
            club officer can respond. The club may also email a copy to its
            official inbox. Submitted messages are not used for advertising or
            made public.
          </p>
          <h2>Orientation progress</h2>
          <p>
            The orientation course saves progress and quiz results in this
            browser. They are not sent to the club. You can clear them with the
            course reset control or your browser’s site-data settings.
          </p>
          <h2>External links</h2>
          <p>
            Social profiles and external reports have their own privacy
            policies. No social feed or tracking pixel is embedded here. Fonts
            and images are served with this website.
          </p>
          <h2>Hosting</h2>
          <p>
            The hosting provider may process technical request data, such as IP
            addresses, to deliver and protect the website. No analytics service
            has been added.
          </p>
          <h2>Questions</h2>
          <p>
            Email <a href="mailto:menengairc@gmail.com">menengairc@gmail.com</a>{" "}
            about your enquiry or a privacy request.
          </p>
        </div>
      </section>
    </>
  );
}
