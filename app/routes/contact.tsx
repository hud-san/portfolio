import { useState } from "react";
import { useAppContext } from "~/root";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { ContactLayout } from "~/components/contact-layout";

export default function Contact() {
  const { isDarkMode } = useAppContext();
  const [name, setName] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ name, inquiryType, message });
  };

  return (
    <ContactLayout isDarkMode={isDarkMode}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="inquiryType">Inquiry Type</Label>
          <Select value={inquiryType} onValueChange={setInquiryType}>
            <SelectTrigger>
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="job">Job Opportunity</SelectItem>
              <SelectItem value="collaboration">Collaboration</SelectItem>
              <SelectItem value="social">Social Connection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
          />
        </div>
        <Button type="submit" className="w-full">Send Message</Button>
      </form>
    </ContactLayout>
  );
}