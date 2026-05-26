# Cau truc du an TravelHub

Du an dang di theo huong feature-based structure: code dung chung nam trong `components`, `api`, `contexts`, `layouts`, `routes`; code nghiep vu rieng nam trong tung thu muc con cua `features`.

```txt
src/
  main.tsx
  App.tsx
  api/
    axiosInstance.ts
    authApi.ts
  assets/
  components/
    shared/
    ui/
    figma/
  constants/
  contexts/
    AuthContext.tsx
  features/
    ai-planner/
    auth/
    chat/
    dashboard/
    destinations/
    feed/
    landing/
    profile/
  hooks/
  layouts/
    RootLayout.tsx
  routes/
    index.tsx
  services/
  styles/
  types/
    auth.ts
  utils/
```

## Vai tro cac thu muc

1. `main.tsx`: diem khoi dong React, render `App`.

2. `App.tsx`: component goc, dat cac provider dung chung va `RouterProvider`.

3. `api/`: chi xu ly request/response voi backend.
   - `axiosInstance.ts`: cau hinh base URL, header, interceptor.
   - `authApi.ts`: cac request lien quan den auth, vi du login.

4. `assets/`: tai nguyen tinh nhu image, icon, file media.

5. `components/`: component dung lai nhieu noi.
   - `components/ui`: component UI nen tang.
   - `components/shared`: component dung chung cua app.
   - `components/figma`: component sinh/nhap tu Figma.

6. `constants/`: hang so, gia tri co dinh.
```ts
export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  STUDENT: "STUDENT",
} as const;
```

7. `contexts/`: React Context cho state dung chung, vi du `AuthContext` quan ly login/logout va user hien tai.

8. `features/`: to chuc theo chuc nang nghiep vu. Moi feature co the co `components`, `api`, `types`, `hooks` rieng neu can.

9. `hooks/`: custom hook dung lai toan app.

10. `layouts/`: khung giao dien chung cua nhieu trang, vi du navbar/main layout.

11. `routes/`: quan ly route va route guard.

12. `services/`: xu ly nghiep vu phuc tap sau khi goi API. Neu logic chi la request backend thi de trong `api`.

13. `styles/`: CSS chung cua app.

14. `types/`: khai bao TypeScript type/interface dung chung.

```ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

## Nguyen tac dat file hien tai

- Page/component thuoc man hinh nao thi nam trong `src/features/<feature>/components`.
- API dung chung hoac theo backend module thi nam trong `src/api`.
- State dang nhap dung chung nam trong `src/contexts/AuthContext.tsx`.
- Type dung chung nam trong `src/types`.
- Component nao dung lai nhieu page thi dua vao `src/components/shared`; component UI co tinh he thong thi de trong `src/components/ui`.
