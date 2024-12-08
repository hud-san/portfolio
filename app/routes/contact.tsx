import { useAppContext } from "~/root";
import { Card, CardContent } from "~/components/ui/card";
import { ContactLayout } from "~/components/contact-layout";

export default function Contact() {
  const { isDarkMode } = useAppContext();

  return (
    <ContactLayout isDarkMode={isDarkMode}>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center mb-6 text-foreground">
            If you'd like to contact me, you can reach out via the following channels:
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Feel free to connect with me on LinkedIn, check out my projects on GitHub, or see what I'm reading on Goodreads.
          </p>
        </CardContent>
      </Card>
    </ContactLayout>
  );
}