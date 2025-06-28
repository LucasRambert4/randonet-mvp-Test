// src/screens/Chat/ConversationScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  Animated,
  Easing,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../supabase-config';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConversationScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { conversation } = route.params;

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const isAutoScrollRef = useRef(true);
  const channelRef = useRef<any>(null);
  const inputContainerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
        Animated.timing(inputContainerAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
        scrollToEnd();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        Animated.timing(inputContainerAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !user) return;
    const { error } = await supabase.from('messages').insert([
      {
        conversation_id: conversation.id,
        sender_id: user.id,
        content: newMessage,
      },
    ]);
    if (!error) {
      setNewMessage('');
      if (!isKeyboardVisible) {
        Keyboard.dismiss();
      }
    }
  };

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (!error) setMessages(data || []);
    };

    fetchInitialMessages();

    const newChannel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToEnd();
        }
      )
      .subscribe();

    channelRef.current = newChannel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversation]);

  const otherUser =
    user?.id === conversation.user1
      ? conversation.user2Profile
      : conversation.user1Profile;

  const inputContainerStyle = {
    paddingBottom: inputContainerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [10, keyboardHeight + 10],
    }),
    backgroundColor: '#013220',
    borderTopWidth: 1,
    borderTopColor: 'gray',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#013220' }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {conversation.otherUserName || 'Conversation'}
            </Text>
          </View>
          <Image
            source={{
              uri: otherUser?.avatar_url || 'https://via.placeholder.com/32',
            }}
            style={styles.avatar}
          />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.messageList}
          onContentSizeChange={scrollToEnd}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender_id === user?.id
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.content}</Text>
            </View>
          )}
        />

        {/* Input Container */}
        <Animated.View style={[styles.inputContainer, inputContainerStyle]}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Message..."
            placeholderTextColor="#ccc"
            style={styles.input}
            multiline
            blurOnSubmit={false}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#2ecc71" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#014b2c',
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageList: {
    paddingBottom: 12,
    paddingTop: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 14,
    marginVertical: 4,
    marginHorizontal: 10,
    maxWidth: '75%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2ecc71',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e8449',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: 14,
    fontSize: 16,
    borderRadius: 12,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
});
