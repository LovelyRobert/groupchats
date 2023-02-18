export class MessageObject {
  constructor(id, userId, nickname, profileImg, messageValue, dataType) {
    (this.id = id),
      (this.userId = userId),
      (this.nickname = nickname),
      (this.value = messageValue),
      (this.dataType = dataType),
      (this.profileImg = profileImg),
      (this.date = null);
  }
}
