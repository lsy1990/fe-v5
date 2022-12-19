/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, message } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getSsoConfig, getRedirectURL, getRedirectURLCAS, getRedirectURLOAuth } from '@/services/login';
import './login.less';

import { useTranslation } from 'react-i18next';
export interface DisplayName {
  oidc: string;
  cas: string;
  oauth: string;
}
export default function Login() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const redirect = location.search && new URLSearchParams(location.search).get('redirect');
  const dispatch = useDispatch();
  const [displayName, setDis] = useState<DisplayName>({
    oidc: 'OIDC',
    cas: 'CAS',
    oauth: 'OAuth',
  });

  useEffect(() => {
    getSsoConfig().then((res) => {
      if (res.dat) {
        setDis({
          oidc: res.dat.oidcDisplayName,
          cas: res.dat.casDisplayName,
          oauth: res.dat.oauthDisplayName,
        });
      }
    });
  }, []);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      login();
    } catch {
      console.log(t('输入有误'));
    }
  };

  const login = async () => {
    let { username, password } = form.getFieldsValue();
    const err = await dispatch({
      type: 'account/login',
      username,
      password,
    });

    if (!err) {
      history.push(redirect || '/metric/explorer');
    }
  };
  getRedirectURLOAuth().then((res) => {
    if (res.dat) {
      window.location.href = res.dat;
    } else {
      message.warning('没有配置 OAuth 登录地址！');
    }
  });
  return (
    <div className='login-warp'>
    </div>
  );
}
