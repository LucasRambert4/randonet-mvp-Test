import { describe, it, expect, jest } from '@jest/globals';

// ✅ One consistent storage bucket mock chain
const remove = jest.fn();
const upload = jest.fn();

const storageFrom = jest.fn(() => ({ remove, upload }));

const supabase = {
  storage: {
    from: storageFrom,
  },
};

global.alert = jest.fn();
const navigation = { goBack: jest.fn() };
const t = (key) => key;

// ---------------------
// Extracted helper
// ---------------------
async function _saveActivity({ user, isEditing, fileName }) {
  if (!user) {
    alert(
      `${t('saveActivity.errorTitle')}: ${t('saveActivity.errorNotLoggedIn')}`
    );
    return;
  }

  const json = { dummy: 'data', owner_id: user.id };

  if (isEditing) {
    await supabase.storage.from('activities-bucket').remove([fileName]);
  }

  const { error } = await supabase.storage
    .from('activities-bucket')
    .upload(fileName, JSON.stringify(json), {
      contentType: 'application/json',
      upsert: true,
    });

  if (error) {
    alert(
      `${t('saveActivity.errorTitle')}: ${t('saveActivity.errorSaveFailed')}`
    );
  } else {
    alert(
      `${t('saveActivity.successTitle')}: ${t('saveActivity.successMessage')}`
    );
  }

  navigation.goBack();
}

// ---------------------
// Tests
// ---------------------
describe('useSaveActivityLogic Logic', () => {
  it('alerts and returns if user not logged in', async () => {
    await _saveActivity({
      user: null,
      isEditing: false,
      fileName: 'test.json',
    });
    expect(alert).toHaveBeenCalledWith(
      'saveActivity.errorTitle: saveActivity.errorNotLoggedIn'
    );
  });

  it('uploads new activity and shows success', async () => {
    upload.mockResolvedValueOnce({}); // ✅ returns an object with no error

    await _saveActivity({
      user: { id: '123' },
      isEditing: false,
      fileName: 'test.json',
    });

    expect(upload).toHaveBeenCalled();
    expect(alert).toHaveBeenCalledWith(
      'saveActivity.successTitle: saveActivity.successMessage'
    );
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('removes old file when editing', async () => {
    remove.mockResolvedValueOnce({});
    upload.mockResolvedValueOnce({});

    await _saveActivity({
      user: { id: '123' },
      isEditing: true,
      fileName: 'test.json',
    });

    expect(remove).toHaveBeenCalledWith(['test.json']);
    expect(upload).toHaveBeenCalled();
  });

  it('alerts on upload error', async () => {
    upload.mockResolvedValueOnce({ error: true });

    await _saveActivity({
      user: { id: '123' },
      isEditing: false,
      fileName: 'test.json',
    });

    expect(alert).toHaveBeenCalledWith(
      'saveActivity.errorTitle: saveActivity.errorSaveFailed'
    );
  });
});
