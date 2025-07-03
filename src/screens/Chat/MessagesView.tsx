import React, { useEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesView({
  messages,
  user,
  flatListRef,
  handleScroll,
  newMessage,
  setNewMessage,
  sendMessage,
  selectedConversation,
  setSelectedConversation,
  getOtherUserName,
}: any) {
  // Always scroll to end on new messages
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#014b2c' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: '#014b2c',
            borderBottomWidth: 1,
            borderBottomColor: '#2c3e50',
          }}
        >
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            {getOtherUserName(selectedConversation)}
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 8,
            paddingBottom: 12,
          }}
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf:
                  item.sender_id === user.id ? 'flex-end' : 'flex-start',
                backgroundColor:
                  item.sender_id === user.id ? '#2ecc71' : '#3498db',
                padding: 10,
                borderRadius: 10,
                marginVertical: 4,
                maxWidth: '75%',
              }}
            >
              <Text style={{ color: 'white' }}>{item.content}</Text>
            </View>
          )}
        />

        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 8,
            backgroundColor: '#013220',
            borderTopWidth: 1,
            borderTopColor: 'gray',
          }}
        >
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Message..."
            placeholderTextColor="#ccc"
            style={{
              flex: 1,
              backgroundColor: '#1a1a1a',
              color: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Text
              style={{
                color: '#2ecc71',
                fontWeight: 'bold',
                padding: 10,
              }}
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
