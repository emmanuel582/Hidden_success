import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How do I become a traveler?',
      answer:
        'Simply create an account, complete your identity verification, and start posting your trips. You can earn money by delivering packages for businesses along your route.',
    },
    {
      question: 'How much can I earn as a traveler?',
      answer:
        'Earnings vary based on distance, package size, and demand. On average, travelers earn ₦5,000-₦20,000 per delivery. You set your own prices within reasonable limits.',
    },
    {
      question: 'How do I request a delivery?',
      answer:
        'As a business, create a delivery request with pickup and delivery locations, package details, and your preferred timeline. We\'ll match you with verified travelers on that route.',
    },
    {
      question: 'Is my package insured?',
      answer:
        'Yes, all deliveries are covered by our insurance policy up to ₦500,000. We also verify all travelers and track deliveries in real-time for added security.',
    },
    {
      question: 'How does payment work?',
      answer:
        'Businesses pay through the app once the traveler accepts. Payment is held securely and released to the traveler after successful delivery confirmation.',
    },
    {
      question: 'What if something goes wrong?',
      answer:
        'Contact our support team immediately. We have a dispute resolution process and will work with both parties to resolve any issues fairly.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/settings')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>How can we help you?</Text>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <MessageCircle size={24} color={Colors.primary} />
              </View>
              <Text style={styles.contactLabel}>Live Chat</Text>
              <Text style={styles.contactDescription}>
                Chat with our support team
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <Mail size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactDescription}>
                support@movever.ng
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard}>
              <View style={styles.contactIcon}>
                <Phone size={24} color={Colors.primary} />
              </View>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactDescription}>
                +234 800 000 0000
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqCard}
              onPress={() => toggleFAQ(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedIndex === index ? (
                  <ChevronUp size={20} color={Colors.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={Colors.textSecondary} />
                )}
              </View>
              {expandedIndex === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Still need help?</Text>
          <Text style={styles.footerText}>
            Our support team is available 24/7 to assist you with any questions
            or concerns.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 24,
  },
  contactSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  contactOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerCard: {
    backgroundColor: Colors.primary + '10',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
