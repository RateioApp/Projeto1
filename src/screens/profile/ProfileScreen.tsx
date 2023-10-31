import React, { useState, useEffect } from 'react' // Importe o useState e useEffect
import { AntDesign } from '@expo/vector-icons'
import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { readUser } from '../../../backend/user-config/user-service'

const Profile = ({ route }) => {
  const [userName] = useState('')
  const [name, setname] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const navigation = useNavigation()
  const { userId } = route.params

  useEffect(() => {
    // Use o userId para buscar as informações do usuário
    readUser(userId)
      .then((userData) => {
        if (userData && userData.name) {
          const name = userData.name

          setname(name)
        }
        if (userData && userData.email) {
          setUserEmail(userData.email) // Atualize o estado com o e-mail do usuário
        }
      })
      .catch((error) => {
        console.error('Erro ao obter dados do usuário', error)
      })
  }, [])

  const onPressChangeName = () => {
    navigation.navigate('ChangeNameScreen', {
      userId: userId,
      currentName: name,
    })
    console.log('Abrir Editar Nome')
    console.log()
  }

  const onPressChangeEmail = () => {
    navigation.navigate('ChangeEmail', {
      userId: userId,
      currentEmail: userEmail,
    })
    console.log('Abrir Editar Email')
  }

  const onPressChangePassword = () => {
    navigation.navigate('ChangePassword')
    console.log('Abrir Editar Senha')
  }

  const formatEmailForDisplay = (email) => {
    if (email.includes('@') && email.length > 26) {
      const atIndex = email.indexOf('@') // Encontre a posição do "@"
      const prefix = email.substring(0, atIndex)
      const suffix = email.substring(atIndex) // Mantenha o "@" e o restante do e-mail
      const displayedEmail = `${prefix.substring(0, 13)}...${suffix}`
      return displayedEmail
    } else {
      return email
    }
  }

  return (
    <View style={styles.container}>
      <AntDesign
        onPress={() => navigation.goBack()}
        name="arrowleft"
        size={30}
        color="white"
        style={styles.arrow}
      />
      <Image
        source={{
          uri: 'https://picsum.photos/300/310',
        }}
        style={styles.profileImage}
      />
      <Pressable style={styles.expenseHistory}>
        <Text style={styles.textBold}>Meu histórico de despesas</Text>
        <AntDesign name="right" size={12} />
      </Pressable>
      <Pressable style={styles.name} onPress={onPressChangeName}>
        <Text style={styles.textBold}>Nome</Text>
        <Text>
          {name} <AntDesign name="right" size={12} />
        </Text>
      </Pressable>
      <Pressable style={styles.changeEmail} onPress={onPressChangeEmail}>
        <Text style={styles.textBold}>Alterar E-mail</Text>
        <Text>
          {formatEmailForDisplay(userEmail)}
          <AntDesign name="right" size={12} />
        </Text>
      </Pressable>
      <Pressable style={styles.changePassword} onPress={onPressChangePassword}>
        <Text style={[styles.textBold]}>Alterar Senha</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Deletar minha conta</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#373b3f',
    flex: 1,
    width: '100%',
    height: 844,
    overflow: 'hidden',
    borderRadius: 8,
  },
  profileImage: {
    alignSelf: 'center',
    top: 83,
    width: 100,
    height: 100,
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#1CC29F',
  },
  expenseHistory: {
    top: 210,
    padding: 16,
    justifyContent: 'space-between',
    right: '6.41%',
    width: '87.69%',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    position: 'absolute',
  },
  name: {
    top: 285,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    right: '6.41%',
    width: '87.69%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    position: 'absolute',
  },
  arrow: {
    position: 'absolute',
    left: 30,
    top: 50,
  },
  button: {
    width: '87.44%',
    top: 489,
    right: '6.67%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    position: 'absolute',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#d73018',
    fontWeight: 'bold',
  },
  textBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  changeEmail: {
    top: 360,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    right: '6.41%',
    width: '87.69%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    position: 'absolute',
  },
  changePassword: {
    top: 414,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    left: '5.9%',
    right: '6.41%',
    width: '87.69%',
    position: 'absolute',
  },
})

export default Profile
