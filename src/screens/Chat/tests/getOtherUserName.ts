export function getOtherUserName(
  conv: any,
  userId: string,
  profiles: any[],
  t: (key: string) => string
) {
  const otherId = conv.user1 === userId ? conv.user2 : conv.user1;
  return (
    profiles.find((p) => p.id === otherId)?.display_name || t('common.unknown')
  );
}
