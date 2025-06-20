# AI 기반 그룹 매칭 알고리즘 구현 (기본)

<div>
  <h3>기능 명세</h3>
  <ul>
    <li>AI는 <strong>사용자 프로필 정보</strong>(직종, 직위, 관심사, 위치, 성별 등)를 기반으로 <strong>최적의 그룹(4~10인)</strong>을 자동으로 구성합니다.</li>
    <li>매칭 알고리즘은 <strong>최소 3개 이상의 공통 관심사</strong>를 가진 사용자를 우선적으로 그룹에 포함합니다.</li>
    <li>사용자 위치 정보를 활용하여 <strong>최대 5km 이내</strong>의 사용자를 같은 그룹으로 묶습니다.</li>
    <li>매칭 정확도는 <strong>80% 이상</strong>을 목표로 하며, <strong>사용자 피드백</strong>을 통해 지속적으로 개선됩니다.</li>
    <li>매칭 결과는 <strong>그룹 생성 시간 기준 5분 이내</strong>에 사용자에게 제공됩니다.</li>
  </ul>
  <h3>UI/UX 설명</h3>
  <ul>
    <li>AI 매칭 진행 상황을 <strong>로딩 애니메이션</strong>과 함께 표시하여 사용자가 기다리는 동안 지루함을 느끼지 않도록 합니다.</li>
    <li>매칭 완료 후 <strong>그룹 멤버 목록</strong>을 보여주고, 각 멤버의 <strong>간단한 프로필 정보</strong>를 제공합니다.</li>
    <li>사용자는 매칭 결과에 대해 <strong>만족도 평가</strong>를 할 수 있으며, <strong>피드백</strong>을 남길 수 있습니다.</li>
    <li>매칭 결과에 불만족스러운 경우, <strong>재매칭 요청</strong>을 할 수 있습니다. (단, 재매칭 횟수 제한)</li>
    <li>매칭 성공/실패 여부에 따라 <strong>적절한 알림 메시지</strong>를 표시합니다.</li>
  </ul>
</div>