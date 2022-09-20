import {useMachine} from '@xstate/react';
import React, {FC} from 'react';
import {ActivityIndicator, Button, FlatList, Text, View} from 'react-native';
import usersInfiniteScrollMachine from '../machine/UsersMachine';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import { getUserFullName } from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'Users'>;

const UsersScreen: FC<Props> = ({navigation}) => {
  const [current, send] = useMachine(usersInfiniteScrollMachine);

  if (current.matches('fetchingUsers')) {
    return <ActivityIndicator size="large" />;
  }

  if (current.context.errorMessage) {
    return <Text>{current.context.errorMessage}</Text>;
  }
  
  return (
    <View style={{flex: 1, width: '100%'}}>
      <FlatList
        data={current.context.data}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          send('SCROLL_TO_BOTTOM');
        }}
        renderItem={({item}) => (
          <Button
            title={getUserFullName(item)}
            onPress={() => navigation.navigate('User', {userId: item.id})}
          />
        )}></FlatList>
    </View>
  );
};

export {UsersScreen};
