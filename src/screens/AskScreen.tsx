import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, FilterChip } from '../components';
import { askConcierge, ChatMessage, SUPPORT_URL } from '../lib/aiConcierge';
import { askDemoConcierge } from '../lib/demoConcierge';
import { isSupabaseConfigured } from '../lib/supabase';
import { colors, radii, spacing } from '../theme';

type Language = 'en' | 'ta';

interface DisplayMessage extends ChatMessage {
  id: string;
  isError?: boolean;
}

const STARTER_PROMPTS = [
  "What's open right now?",
  'Plan me a rainy-day itinerary',
  'Do I need an E-Pass?',
  'How do I get to Pykara?',
];

export function AskScreen() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<DisplayMessage>>(null);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMessage: DisplayMessage = { id: `${Date.now()}-user`, role: 'user', content: trimmed };
    const history: ChatMessage[] = messages.map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    if (!isSupabaseConfigured) {
      // Demo mode: answer locally, no network call, so it works before any
      // backend is deployed. Real Supabase config switches this off
      // automatically — see isSupabaseConfigured in lib/supabase.ts.
      const reply = askDemoConcierge(trimmed);
      setMessages((prev) => [...prev, { id: `${Date.now()}-assistant`, role: 'assistant', content: reply }]);
      setSending(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
      return;
    }

    try {
      const { reply } = await askConcierge(trimmed, history, language);
      setMessages((prev) => [...prev, { id: `${Date.now()}-assistant`, role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: 'assistant',
          isError: true,
          content:
            "I can't reach the AI concierge right now — it hasn't been switched on for this app yet. Tap below to reach OotyMade directly instead.",
        },
      ]);
    } finally {
      setSending(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <ThemedText variant="display" style={styles.title}>
          Ask
        </ThemedText>
        <View style={styles.languageRow}>
          <FilterChip label="EN" selected={language === 'en'} onPress={() => setLanguage('en')} />
          <FilterChip label="தமிழ்" selected={language === 'ta'} onPress={() => setLanguage('ta')} />
        </View>
      </View>

      {!isSupabaseConfigured ? (
        <View style={styles.demoBanner}>
          <Ionicons name="flask-outline" size={14} color={colors.accentText} />
          <ThemedText variant="caption" style={styles.demoBannerText}>
            Demo mode — answering from a small offline keyword matcher, not real AI. Connect
            Supabase + Anthropic for the real concierge.
          </ThemedText>
        </View>
      ) : null}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText variant="body" style={styles.emptyText}>
              Ask anything about visiting Ooty and the Nilgiris — I'll only answer from what
              OotyMade has actually verified.
            </ThemedText>
            <View style={styles.starterWrap}>
              {STARTER_PROMPTS.map((prompt) => (
                <Pressable
                  key={prompt}
                  style={styles.starterChip}
                  onPress={() => sendMessage(prompt)}
                  accessibilityRole="button"
                  accessibilityLabel={prompt}
                >
                  <ThemedText variant="caption" style={styles.starterText}>
                    {prompt}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => <MessageBubble message={item} />}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {sending ? (
          <View style={styles.typingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <ThemedText variant="caption" style={styles.typingText}>
              Thinking…
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about Ooty…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            multiline
          />
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={sending || !input.trim()}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            accessibilityState={{ disabled: sending || !input.trim() }}
            style={({ pressed }) => [
              styles.sendButton,
              (sending || !input.trim()) && styles.sendButtonDisabled,
              pressed && styles.sendButtonPressed,
            ]}
          >
            <Ionicons name="send" size={18} color={colors.textOnPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageBubble({ message }: { message: DisplayMessage }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAssistant]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
          message.isError && styles.bubbleError,
        ]}
      >
        <ThemedText variant="body" style={isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant}>
          {message.content}
        </ThemedText>
        {message.isError ? (
          <Pressable
            onPress={() => Linking.openURL(SUPPORT_URL)}
            accessibilityRole="link"
            accessibilityLabel="Open OotyMade support"
            style={styles.supportLink}
          >
            <ThemedText variant="bodyMedium" style={styles.supportLinkText}>
              Open OotyMade support →
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  title: {
    marginBottom: 0,
  },
  languageRow: {
    flexDirection: 'row',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accentText,
  },
  demoBannerText: {
    flex: 1,
    color: colors.accentText,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textMuted,
  },
  starterWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  starterChip: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  starterText: {
    color: colors.primary,
  },
  messageList: {
    padding: spacing.md,
  },
  bubbleRow: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleError: {
    borderColor: colors.danger,
  },
  bubbleTextUser: {
    color: colors.textOnPrimary,
  },
  bubbleTextAssistant: {
    color: colors.text,
  },
  supportLink: {
    marginTop: spacing.sm,
  },
  supportLinkText: {
    color: colors.primary,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
  },
  typingText: {
    color: colors.textMuted,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
    maxHeight: 120,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
});
