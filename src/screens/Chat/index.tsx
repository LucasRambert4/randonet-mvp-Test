import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import ConversationList from './ConversationList';
import MessagesView from './MessagesView';
import useChatScreenLogic from './ChatScreen.logic';
import styles from './ChatScreen.styles';

export default function ChatScreen() {
  const {
    topPadding,
    selectedConversation,
    setSelectedConversation,
    navigation,
    search,
    setSearch,
    tab,
    setTab,
    conversations,
    getOtherUserName,
    t,
    user,
    profiles,
    messages,
    newMessage,
    setNewMessage,
    flatListRef,
    handleScroll,
    sendMessage,
  } = useChatScreenLogic();

  if (!selectedConversation) {
    return (
      <ConversationList
        navigation={navigation}
        topPadding={topPadding}
        search={search}
        setSearch={setSearch}
        tab={tab}
        setTab={setTab}
        conversations={conversations}
        setSelectedConversation={setSelectedConversation}
        getOtherUserName={getOtherUserName}
        t={t}
        user={user}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.messagesContainer, { paddingTop: topPadding }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <MessagesView
          messages={messages}
          user={user}
          flatListRef={flatListRef}
          handleScroll={handleScroll}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          getOtherUserName={getOtherUserName}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
