import React, { useState, useCallback, memo } from 'react'; 
// memo와 useCallback을 사용하여 입력 안정성을 극대화합니다.

// ------------------- (1) AddCompanyModal 컴포넌트 분리 및 안정화 -------------------
// 모달 내부에서 자체적으로 입력 상태를 관리하도록 수정합니다. (입력 안정화)
const AddCompanyModal = memo(({ show, onClose, onSave }) => {
    if (!show) return null;

    // 모달 내부 상태: 입력 중 커서가 튕기는 것을 방지하기 위해 여기서 상태를 관리합니다.
    const [modalNewCompany, setModalNewCompany] = useState({
        registrationNumber: '',
        name: '',
        owner: '',
        phone: '',
        area: '',
    });

    // 입력 필드 변경 핸들러 (커서 안정화의 핵심)
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setModalNewCompany(prevData => ({ ...prevData, [name]: value }));
    }, []);

    // 모달 닫기 및 초기화 함수
    const closeModal = () => {
        // 모달 닫기 전 입력 값 초기화
        setModalNewCompany({ registrationNumber: '', name: '', owner: '', phone: '', area: '' });
        onClose();
    };

    // 추가 버튼 클릭 핸들러
    const handleAdd = () => {
        if (!modalNewCompany.name || !modalNewCompany.owner || !modalNewCompany.registrationNumber || !modalNewCompany.phone || !modalNewCompany.area) {
            alert('모든 필수 정보를 입력해주세요.'); 
            return;
        }
        
        onSave(modalNewCompany); // 최종 데이터를 부모 컴포넌트에 전달하여 저장
        closeModal(); // 모달 닫기 및 초기화
    };

    // 모든 입력 필드를 배열로 정의하여 렌더링 시 key를 명시적으로 부여
    const inputFields = [
        { name: 'registrationNumber', label: '사업자 등록번호', placeholder: '예: 123-45-67890' },
        { name: 'name', label: '업체명', placeholder: '업체명 입력' },
        { name: 'owner', label: '대표자 이름', placeholder: '대표자 이름 입력' },
        { name: 'phone', label: '전화번호', placeholder: '예: 010-1234-5678' },
        { name: 'area', label: '담당 지역', placeholder: '담당 지역 입력' },
    ];

    return (
        // 모달 배경
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            {/* 모달 내용 */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">새 업체 추가</h2>
                <div className="space-y-4">
                    {inputFields.map(({ name, label, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input
                                // key prop을 명시적으로 추가하여 React가 필드를 고유하게 식별하도록 함
                                key={name} 
                                type="text"
                                name={name}
                                value={modalNewCompany[name]}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-colors"
                                placeholder={placeholder}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                    <button
                        className="bg-gray-300 text-gray-800 py-2 px-5 rounded-xl hover:bg-gray-400 transition-colors font-medium"
                        onClick={closeModal} // 취소 시 초기화 및 닫기
                    >
                        취소
                    </button>
                    <button
                        className="bg-green-600 text-white py-2 px-5 rounded-xl hover:bg-green-700 transition-colors font-medium"
                        onClick={handleAdd} // 저장
                    >
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
});


const AdminDashboard = () => {
    // ------------------- 상태 관리 -------------------
    const [currentPage, setCurrentPage] = useState('users'); // users, community, reports, companies
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPost, setSelectedPost] = useState(null); // 게시글 상세 보기 (Post Detail View)
    const [filterPostId, setFilterPostId] = useState(null); // 댓글 필터링을 위한 Post ID
    const [currentReportView, setCurrentReportView] = useState('illegal_dumping'); // illegal_dumping, community_abuse
    const [showAddCompanyModal, setShowAddCompanyModal] = useState(false); // 업체 추가 모달 표시 여부
    
    // 더미 데이터
    const [users, setUsers] = useState([
        { id: 1, name: '김철수', email: 'chulsu@example.com', role: '일반', status: '활성' },
        { id: 2, name: '이영희', email: 'yhlee@example.com', role: '업체', status: '정지' },
        { id: 3, name: '박민지', email: 'minji@example.com', role: '일반', status: '활성' },
        { id: 4, name: '최강희', email: 'khchoi@example.com', role: '관리자', status: '활성' },
        { id: 5, name: '홍길동', email: 'gdhong@example.com', role: '일반', status: '휴면' },
    ]);
    
    // 신고 관리 데이터 추가 (category 필드 추가)
    const [reports, setReports] = useState([
        // 커뮤니티 신고
        { id: 1, category: 'community_abuse', type: '댓글', targetId: 503, reason: '광고/홍보', reporter: '사용자A', date: '2025-09-01', status: '접수' },
        { id: 3, category: 'community_abuse', type: '사용자', targetId: 2, reason: '욕설/비방', reporter: '사용자B', date: '2025-09-03', status: '완료' },
        // 불법 쓰레기 투기 신고
        { id: 2, category: 'illegal_dumping', type: '게시글', targetId: 101, reason: '불법 투기 장소', reporter: '익명', date: '2025-09-02', status: '처리 중' },
        { id: 4, category: 'illegal_dumping', type: '직접 신고', targetId: 200, reason: '음식물 쓰레기 방치', reporter: '주민C', date: '2025-09-04', status: '접수' },
    ]);

    // 업체 관리 데이터 추가
    const [companies, setCompanies] = useState([
        { id: 10, registrationNumber: '123-45-67890', name: '그린 청소 대행', owner: '박대표', phone: '010-1234-5678', area: '강남구', license: '정상', status: '활성' },
        { id: 11, registrationNumber: '987-65-43210', name: '신속 폐기물 처리', owner: '최사장', phone: '010-9876-5432', area: '송파구', license: '만료 예정', status: '주의' },
    ]);

    const [posts, setPosts] = useState([
        { id: 101, title: '우리 동네 불법 투기 해결!', author: '김철수', date: '2025-07-20', commentsCount: 5, status: '공개', content: "우리 동네 길거리와 공원에 불법 투기가 너무 심해서 미관을 해치고 있습니다. 빠른 조치 부탁드립니다." },
        { id: 102, title: '분리수거 꿀팁 공유합니다.', author: '박민지', date: '2025-07-19', commentsCount: 12, status: '공개', content: "투명 페트병은 라벨을 제거하고 압축해서 버리면 부피를 훨씬 줄일 수 있어요! 모두 실천해봐요." },
        { id: 103, title: '새로운 신고 정책 문의', author: '관리자A', date: '2025-07-18', commentsCount: 0, status: '비공개', content: "최근 개정된 쓰레기 무단투기 신고 정책에 대해 자세한 설명을 부탁드립니다. 포상금 지급 기준이 궁금합니다." },
        { id: 104, title: '폐기물 처리 절차 변경 안내', author: '최강희', date: '2025-07-17', commentsCount: 2, status: '공개', content: "대형 폐기물 처리 절차가 8월 1일부터 온라인 신고제로 변경됩니다. 기존의 스티커 구매 방식은 폐지되오니 유의해 주십시오." },
    ]);

    const [comments, setComments] = useState([
        { id: 501, content: '좋은 정보 감사합니다!', postId: 101, author: '이영희', date: '2025-07-21', status: '활성' },
        { id: 502, content: '여기도 쓰레기가 많아요.', postId: 101, author: '관리자A', date: '2025-07-21', status: '활성' },
        { id: 503, content: '광고 댓글입니다. 삭제 필요.', postId: 102, author: '스팸맨', date: '2025-07-20', status: '신고됨' },
        { id: 504, content: '해당 내용을 확인 후 조치하겠습니다.', postId: 103, author: '박민지', date: '2025-07-18', status: '활성' },
        { id: 505, content: '저도 그 정책 궁금합니다.', postId: 104, author: '김철수', date: '2025-07-17', status: '활성' },
        { id: 506, content: '스티커 사라지니 좋네요.', postId: 104, author: '홍길동', date: '2025-07-17', status: '활성' },
    ]);

    // ------------------- 필터링 로직 -------------------
    const getFilteredData = (data, keys) => {
        let filtered = data;
        
        // 1. 댓글 ID 필터링 (댓글 탭에서만 작동)
        if (filterPostId && currentPage === 'community' && data === comments) {
            filtered = filtered.filter(comment => comment.postId === filterPostId);
        }

        // 2. 신고 카테고리 필터링 (신고 탭에서만 작동)
        if (currentPage === 'reports' && data === reports) {
            filtered = filtered.filter(report => report.category === currentReportView);
        }

        // 3. 검색어 필터링
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(item => 
                keys.some(key => {
                    const value = item[key];
                    if (value === undefined || value === null) return false;
                    return String(value).toLowerCase().includes(lowerCaseSearch);
                })
            );
        }
        return filtered;
    };

    // 검색 대상 키 정의
    const filteredUsers = getFilteredData(users, ['name', 'email']); 
    const filteredPosts = getFilteredData(posts, ['title', 'author']); 
    const filteredComments = getFilteredData(comments, ['content', 'author']);
    const filteredReports = getFilteredData(reports, ['type', 'reason', 'reporter']);
    // 업체 검색 키에 'registrationNumber', 'phone' 추가
    const filteredCompanies = getFilteredData(companies, ['name', 'owner', 'area', 'registrationNumber', 'phone']);

    // ------------------- 액션 핸들러 -------------------
    const handleAction = (type, action, id) => {
        // [IMPORTANT] Oñembojehe'a console.log hendaguépe alert/confirm
        console.log(`[ACTION] ${type} - ID ${id} 에 대한 '${action}' 작업 실행됨.`);

        if (type === '사용자') {
            setUsers(prevUsers => prevUsers.map(u => 
                u.id === id ? { ...u, status: action === '정지' ? '정지' : action === '활성' ? '활성' : action === '경고' ? '경고' : action === '수정' ? u.status : u.status } : u
            ));
            if (action === '수정') console.log(`[피드백] 사용자 ID ${id} 정보가 저장되었습니다. (더미).`);
        }
        
        if (type === '댓글') {
             setComments(prevComments => prevComments.map(c => 
                c.id === id ? { ...c, status: action === '삭제' ? '삭제됨' : action === '활성' ? '활성' : c.status } : c
            ));
            if (action === '수정') console.log(`[피드백] 댓글 ID ${id} 내용이 저장되었습니다. (더미).`);
        }
        
        if (type === '게시글') {
            if (action === '삭제') {
                setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
                if (selectedPost && selectedPost.id === id) {
                     setSelectedPost(null);
                }
                setComments(prevComments => prevComments.filter(c => c.postId !== id));
                console.log(`[결과] 게시글 ID ${id} 삭제 완료. 목록으로 돌아갑니다.`);
            } else if (action === '수정') {
                console.log(`[피드백] 게시글 ID ${id} 수정 내용이 저장되었습니다. (더미).`);
            }
        }

        // 신고 처리 액션
        if (type === '신고') {
             const report = reports.find(r => r.id === id);
             if (!report) return;

             let newStatus = report.status;
             
             if (report.category === 'illegal_dumping') {
                // 불법 투기 신고 (기존 로직 유지)
                newStatus = action === '처리' ? '처리 중' : action === '완료' ? '완료' : report.status;
                setReports(prevReports => prevReports.map(r => 
                    r.id === id ? { ...r, status: newStatus } : r
                ));
             } else if (report.category === 'community_abuse') {
                // 커뮤니티 신고 (경고/정지/완료 로직)
                newStatus = action === '경고' ? '경고' : action === '정지' ? '정지' : action === '활성' ? '완료' : report.status;
                
                // Oñemoambue estado tapicha oñembyatýva
                if (report.type === '사용자' && (action === '경고' || action === '정지')) {
                    handleAction('사용자', action, report.targetId); // Oñembohasa tapicha estado
                }
                
                setReports(prevReports => prevReports.map(r => 
                    r.id === id ? { ...r, status: newStatus, isProcessed: true } : r
                ));
             }
            
             if (action === '경고' || action === '정지') console.log(`[피드백] 신고 ID ${id}에 대해 ${action} 처리 완료.`);
             if (action === '처리') console.log(`[피드백] 신고 ID ${id} 처리 상태 변경됨.`);
             if (action === '완료') console.log(`[피드백] 신고 ID ${id} 처리 완료됨.`);
        }

        // Tembiapo Ñangareko Réra
        if (type === '업체') {
             if (action === '정지') {
                 setCompanies(prevCompanies => prevCompanies.map(c => 
                    c.id === id ? { ...c, status: '정지' } : c
                 ));
             } else if (action === '활성') {
                 setCompanies(prevCompanies => prevCompanies.map(c => 
                    c.id === id ? { ...c, status: '활성' } : c
                 ));
             }
             if (action === '수정') console.log(`[피드백] 업체 ID ${id} 정보가 저장되었습니다. (더미).`);
        }
    };

    // Apopyrã oñembojoapýva pyahu (Oñeme'ẽ dato ipahaguéva modal-gui)
    const handleAddNewCompany = (companyData) => {
        const newId = Math.max(...companies.map(c => c.id)) + 1;
        const companyToAdd = {
            id: newId,
            ...companyData, // Oñeme'ẽ dato oñembojopyru va'ekue modal-gui
            license: '정상', 
            status: '활성', 
        };

        setCompanies(prevCompanies => [...prevCompanies, companyToAdd]);
        setShowAddCompanyModal(false); // Oñemboty modal
        console.log(`[피드백] 새로운 업체 ID ${newId}가 추가되었습니다.`);
    };

    // Tembiapo ohechaukávo ha'ãnga'ỹrã detalle rehegua (Acción de ver detalle de publicación)
    const handleViewDetail = (post) => {
        setSelectedPost(post);
        setFilterPostId(null); // Oñembopotĩ pe filtro
    };

    // Ojehecha jave jehaipyre oñembojoajupýva oñembojoaju pe tendaha jehaipyre tenondegua
    const handleViewCommentsByPostId = (postId) => {
        setCurrentPage('community');
        setFilterPostId(postId);
        setSelectedPost(null); // Oñemboty pe detalle
    };

    // ------------------- Ñe'ẽmbyry Oñemongu'éva (Barra Lateral) -------------------
    const Sidebar = () => (
        <nav className="p-4 space-y-2 bg-gray-800 text-white h-full shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-8 text-green-400 border-b border-green-600 pb-4">BARO GREEN Admin</h2>
            <SidebarItem label="사용자 관리" page="users" icon="👥" />
            <SidebarItem label="커뮤니티 관리" page="community" icon="📝💬" />
            <SidebarItem label="신고 관리" page="reports" icon="🚨" />
            <SidebarItem label="업체 관리" page="companies" icon="🏢" />
            <div className="pt-12 text-sm text-gray-400">
                <p>v1.0.0</p>
                <button className="text-gray-400 hover:text-red-400 transition-colors">로그아웃</button>
            </div>
        </nav>
    );

    // SidebarItem oñemoambuéva
    const SidebarItem = ({ label, page, icon }) => (
        <button
            className={`block w-full py-3 px-4 text-left rounded-xl transition-all duration-300 flex items-center space-x-3 ${
                currentPage === page 
                    ? 'bg-green-600 text-white font-semibold shadow-lg shadow-green-700/50' 
                    : 'hover:bg-gray-700 text-gray-300 hover:text-white'
            }`}
            onClick={() => {
                setCurrentPage(page);
                setSearchTerm(''); 
                setSelectedPost(null);
                setFilterPostId(null); // 새 탭 이동 시 댓글 필터링 초기화
                setCurrentReportView('illegal_dumping'); // 신고 탭 이동 시 기본값으로 초기화
                setShowAddCompanyModal(false); // 업체 추가 모달 닫기
            }}
        >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
        </button>
    );

    const Header = ({ title }) => {
        // Placeholder oñemoambuéva
        const searchPlaceholder = currentPage === 'users' ? '사용자 이름/이메일 검색...' 
                                : currentPage === 'reports' ? '신고 내용/신고자 검색...'
                                : currentPage === 'companies' ? '업체명/대표자/지역/사업자 등록번호/전화번호 검색...' // 검색 Placeholder 업데이트
                                : `${title} 검색...`;
        
        return (
            <header className="p-5 border-b bg-white flex justify-between items-center shadow-md">
                <h1 className="text-3xl font-extrabold text-gray-800">{title}</h1>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        // Oñemoambue placeholder
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition-all duration-200 w-64 shadow-inner"
                    />
                </div>
            </header>
        );
    };

    const StatusBadge = ({ status, bgColor, textColor }) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
            {status}
        </span>
    );

    // ------------------- PostCommentsSection Componente -------------------
    const PostCommentsSection = ({ postId, allComments, onAction }) => {
        // Oñembosarái jehaipyre
        const postComments = allComments.filter(c => c.postId === postId);

        return (
            <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">댓글 목록 ({postComments.length}개)</h3>
                
                {postComments.length === 0 ? (
                    <p className="text-gray-500 p-4 bg-gray-100 rounded-lg">아직 등록된 댓글이 없습니다.</p>
                ) : (
                    <div className="space-y-4">
                        {postComments.map((comment) => (
                            <div key={comment.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex justify-between items-start">
                                <div>
                                    <p className="text-gray-900 font-medium">{comment.content}</p>
                                    <div className="text-xs text-gray-500 mt-1 space-x-3">
                                        <span>작성자: {comment.author}</span>
                                        <span>작성일: {comment.date}</span>
                                        <StatusBadge 
                                            status={comment.status} 
                                            bgColor={comment.status === '활성' ? 'bg-green-100' : comment.status === '신고됨' ? 'bg-yellow-100' : 'bg-red-100'} 
                                            textColor={comment.status === '활성' ? 'text-green-800' : comment.status === '신고됨' ? 'text-yellow-800' : 'text-red-800'} 
                                        />
                                    </div>
                                </div>
                                <div className="space-x-2 flex-shrink-0">
                                    {comment.status !== '삭제됨' ? (
                                        <button className="text-red-600 hover:text-red-900 text-sm font-medium" onClick={() => {
                                            if (window.confirm(`댓글 ID ${comment.id}을(를) 정말로 삭제하시겠습니까?`)) {
                                                onAction('댓글', '삭제', comment.id);
                                            }
                                        }}>삭제</button>
                                    ) : (
                                        <span className="text-gray-500 text-sm">삭제됨</span>
                                    )}
                                    {comment.status !== '활성' && (
                                        <button className="text-green-600 hover:text-green-900 text-sm font-medium" onClick={() => onAction('댓글', '활성', comment.id)}>활성</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // ------------------- PostDetailView Componente (Ojehechakuaa porãve haguã) -------------------
    const PostDetailView = ({ post, onBack, onDelete, allComments, onCommentAction }) => (
        <div className="p-8 bg-white rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{post.title}</h2>
            
            {/* Post meta rehegua */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 mb-8 border-b pb-4">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700 mr-2">작성자:</span> {post.author}
                </p>
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700 mr-2">작성일:</span> {post.date}
                </p>
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700 mr-2">상태:</span> 
                    <StatusBadge status={post.status} bgColor="bg-green-100" textColor="text-green-800" />
                </p>
            </div>

            {/* Post Contenido rehegua */}
            <div className="mb-10 p-4 bg-gray-50 rounded-lg border min-h-[100px]">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Jehaipyre oñembojoapýva */}
            <PostCommentsSection postId={post.id} allComments={allComments} onAction={onCommentAction} />

            {/* Apopyrã oñembojoapýva */}
            <div className="mt-8 flex justify-between items-center border-t pt-4">
                <button
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                    onClick={onBack}
                >
                    &larr; 목록으로 돌아가기
                </button>
                <div className="space-x-2">
                    <button 
                        className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors py-2 px-4 rounded-xl border border-indigo-200 hover:border-indigo-400" 
                        onClick={() => onCommentAction('게시글', '수정', post.id)} // 수정 기능 연결
                    >
                        게시글 수정
                    </button>
                    <button 
                        className="bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-colors font-medium" 
                        onClick={() => {
                            console.log(`[CONFIRM] 게시글 ID ${post.id}을(를) 정말로 삭제하시겠습니까? (삭제 실행)`);
                            onDelete(post.id); // Oñembohasa pe apopyrã oñemboguéva
                        }}
                    >
                        게시글 삭제
                    </button>
                </div>
            </div>
        </div>
    );
    
    // ------------------- Tembipotápe Mesa'ãnga (Tablas) -------------------
    const UserTable = () => (
        <div className="p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-700">회원 목록 ({filteredUsers.length}명)</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">이름</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">이메일</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">역할</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">액션</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan="6" className="py-4 text-center text-gray-500">검색 결과가 없습니다.</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-code text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.status === '활성' && <StatusBadge status="활성" bgColor="bg-green-100" textColor="text-green-800" />}
                                        {user.status === '정지' && <StatusBadge status="정지" bgColor="bg-red-100" textColor="text-red-800" />}
                                        {user.status === '휴면' && <StatusBadge status="휴면" bgColor="bg-yellow-100" textColor="text-yellow-800" />}
                                        {user.status === '경고' && <StatusBadge status="경고" bgColor="bg-orange-100" textColor="text-orange-800" />}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <button 
                                            className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors p-1" 
                                            onClick={() => handleAction('사용자', '수정', user.id)}
                                        >
                                            수정
                                        </button>
                                        {user.status !== '정지' ? (
                                            <button 
                                                className="text-red-600 hover:text-red-900 font-medium transition-colors p-1" 
                                                onClick={() => handleAction('사용자', '정지', user.id)}
                                            >
                                                정지
                                            </button>
                                        ) : (
                                            <button 
                                                className="text-green-600 hover:text-green-900 font-medium transition-colors p-1" 
                                                onClick={() => handleAction('사용자', '활성', user.id)}
                                            >
                                                활성 해제
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const PostTable = () => (
        <div className="p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-700">게시글 목록 ({filteredPosts.length}개)</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">제목</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">작성자</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">작성일</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">댓글 수</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">액션</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                         {filteredPosts.length === 0 ? (
                            <tr><td colSpan="6" className="py-4 text-center text-gray-500">검색 결과가 없습니다.</td></tr>
                        ) : (
                            filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-code text-gray-900">{post.id}</td>
                                    {/* 제목 클릭 시 상세보기 기능 연결 */}
                                    <td className="px-6 py-4 max-w-sm truncate text-sm font-medium text-gray-900 cursor-pointer hover:underline text-indigo-600"
                                        onClick={() => handleViewDetail(post)}>
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                                    
                                    {/* 댓글 수 클릭 시 댓글 탭으로 이동 및 필터링 */}
                                    <td 
                                        className={`px-6 py-4 whitespace-nowrap text-sm text-center font-bold ${post.commentsCount > 0 ? 'text-green-600 cursor-pointer hover:underline' : 'text-gray-500'}`}
                                        onClick={() => post.commentsCount > 0 && handleViewCommentsByPostId(post.id)}
                                    >
                                        {post.commentsCount}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors p-1" onClick={() => handleAction('게시글', '수정', post.id)}>수정</button>
                                        <button className="text-red-600 hover:text-red-900 font-medium transition-colors p-1" onClick={() => {
                                            if (window.confirm(`게시글 ID ${post.id}을(를) 정말로 삭제하시겠습니까?`)) {
                                                handleAction('게시글', '삭제', post.id);
                                            }
                                        }}>삭제</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const CommentTable = () => (
        <div className="p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-700">
                댓글 목록 ({filteredComments.length}개)
                {filterPostId && (
                    <span className="ml-4 text-base font-medium text-indigo-600 border border-indigo-200 rounded-full px-3 py-1">
                        게시글 ID: {filterPostId} 필터링 중 
                        <button 
                            className="ml-2 text-red-500 hover:text-red-700 font-bold"
                            onClick={() => setFilterPostId(null)}
                        >
                             &times;
                        </button>
                    </span>
                )}
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">내용</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">작성자</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">게시글 ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">액션</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredComments.length === 0 ? (
                            <tr><td colSpan="6" className="py-4 text-center text-gray-500">
                                {filterPostId ? `게시글 ID ${filterPostId}에 대한 댓글이 없습니다.` : '검색 결과가 없습니다.'}
                            </td></tr>
                        ) : (
                            filteredComments.map((comment) => (
                                <tr key={comment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-code text-gray-900">{comment.id}</td>
                                    <td className="px-6 py-4 max-w-md truncate text-sm font-medium text-gray-900">{comment.content}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.postId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {comment.status === '활성' && <StatusBadge status="활성" bgColor="bg-green-100" textColor="text-green-800" />}
                                        {comment.status === '신고됨' && <StatusBadge status="신고됨" bgColor="bg-yellow-100" textColor="text-yellow-800" />}
                                        {comment.status === '삭제됨' && <StatusBadge status="삭제됨" bgColor="bg-red-100" textColor="text-red-800" />}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        {comment.status !== '삭제됨' ? (
                                            <button className="text-red-600 hover:text-red-900 font-medium transition-colors p-1" onClick={() => {
                                                if (window.confirm(`댓글 ID ${comment.id}을(를) 정말로 삭제하시겠습니까?`)) {
                                                    handleAction('댓글', '삭제', comment.id);
                                                }
                                            }}>삭제</button>
                                        ) : (
                                            <button className="text-gray-500 font-medium p-1" disabled>삭제됨</button>
                                        )}
                                        {comment.status !== '활성' && (
                                            <button className="text-green-600 hover:text-green-900 font-medium transition-colors p-1" onClick={() => handleAction('댓글', '활성', comment.id)}>활성</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ------------------- 신고 관리 테이블 추가 -------------------
    const ReportTable = () => {
        // Téra oñemoĩva pe estado-pe
        const getTableTitle = () => {
            switch(currentReportView) {
                case 'illegal_dumping':
                    return '불법 쓰레기 투기 신고 목록';
                case 'community_abuse':
                    return '커뮤니티/유저 신고 목록';
                default:
                    return '신고 목록';
            }
        };

        return (
            <div className="p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-700">
                        {getTableTitle()} ({filteredReports.length}개)
                    </h3>
                    {/* 신고 관리 하위 탭 버튼 */}
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl shadow-inner">
                        <button 
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${currentReportView === 'illegal_dumping' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setCurrentReportView('illegal_dumping')}
                        >
                            불법 투기 신고
                        </button>
                        <button 
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${currentReportView === 'community_abuse' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
                            onClick={() => setCurrentReportView('community_abuse')}
                        >
                            커뮤니티 신고
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">신고 대상</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">대상 ID</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">사유</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">신고자</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">상태</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">액션</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredReports.length === 0 ? (
                                <tr><td colSpan="7" className="py-4 text-center text-gray-500">신고 내역이 없습니다.</td></tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-code text-gray-900">{report.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.targetId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reporter}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {report.status === '접수' && <StatusBadge status="접수" bgColor="bg-red-100" textColor="text-red-800" />}
                                            {report.status === '처리 중' && <StatusBadge status="처리 중" bgColor="bg-yellow-100" textColor="text-yellow-800" />}
                                            {report.status === '완료' && <StatusBadge status="완료" bgColor="bg-green-100" textColor="text-green-800" />}
                                            {report.status === '경고' && <StatusBadge status="경고" bgColor="bg-orange-100" textColor="text-orange-800" />}
                                            {report.status === '정지' && <StatusBadge status="정지" bgColor="bg-red-500" textColor="text-white" />}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            {report.category === 'illegal_dumping' ? (
                                                <>
                                                    {report.status === '접수' && (
                                                        <button className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors p-1" onClick={() => handleAction('신고', '처리', report.id)}>처리 시작</button>
                                                    )}
                                                    {report.status === '처리 중' && (
                                                        <button className="text-green-600 hover:text-green-900 font-medium transition-colors p-1" onClick={() => handleAction('신고', '완료', report.id)}>처리 완료</button>
                                                    )}
                                                    {report.status === '완료' && (
                                                        <span className="text-gray-500 p-1">완료됨</span>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {(report.status === '접수' || report.status === '경고') && (
                                                        <button className="text-orange-600 hover:text-orange-900 font-medium transition-colors p-1" onClick={() => handleAction('신고', '경고', report.id)}>경고</button>
                                                    )}
                                                    {(report.status === '접수' || report.status === '경고') && (
                                                        <button className="text-red-600 hover:text-red-900 font-medium transition-colors p-1" onClick={() => handleAction('신고', '정지', report.id)}>정지</button>
                                                    )}
                                                    {(report.status === '경고' || report.status === '정지') && (
                                                        <button className="text-green-600 hover:text-green-900 font-medium transition-colors p-1" onClick={() => handleAction('신고', '활성', report.id)}>해제</button>
                                                    )}
                                                    {report.status === '완료' && (
                                                        <span className="text-gray-500 p-1">완료됨</span>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // ------------------- Tabla Apopyrã rehegua -------------------
    const CompanyTable = () => (
        <div className="p-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-700">업체 목록 ({filteredCompanies.length}개)</h3>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center space-x-2"
                    onClick={() => setShowAddCompanyModal(true)}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    <span>업체 추가</span>
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">사업자 등록번호</th> 
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">업체명</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">대표자</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">연락처</th> 
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">담당 지역</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-green-700 uppercase tracking-wider">액션</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredCompanies.length === 0 ? (
                            <tr><td colSpan="8" className="py-4 text-center text-gray-500">검색 결과가 없습니다.</td></tr>
                        ) : (
                            filteredCompanies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-code text-gray-900">{company.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.registrationNumber}</td> 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.owner}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.phone}</td> 
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {company.status === '활성' && <StatusBadge status="활성" bgColor="bg-green-100" textColor="text-green-800" />}
                                        {company.status === '주의' && <StatusBadge status="주의" bgColor="bg-yellow-100" textColor="text-yellow-800" />}
                                        {company.status === '정지' && <StatusBadge status="정지" bgColor="bg-red-100" textColor="text-red-800" />}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors p-1" onClick={() => handleAction('업체', '수정', company.id)}>수정</button>
                                        {company.status !== '정지' ? (
                                            <button className="text-red-600 hover:text-red-900 font-medium transition-colors p-1" onClick={() => handleAction('업체', '정지', company.id)}>정지</button>
                                        ) : (
                                            <button className="text-green-600 hover:text-green-900 font-medium transition-colors p-1" onClick={() => handleAction('업체', '활성', company.id)}>활성 해제</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    // ------------------- Ha'ãnga'ỹrã Mba'ekuaarã (Main Render) -------------------
    const renderContent = () => {
        // Ojehechakuaa porãve haguã
        if (selectedPost) {
            return (
                <PostDetailView
                    post={selectedPost}
                    onBack={() => setSelectedPost(null)}
                    onDelete={postId => handleAction('게시글', '삭제', postId)}
                    allComments={comments} // Oñeme'ẽ jehaipyre
                    onCommentAction={handleAction} // Oñeme'ẽ apopyrã
                />
            );
        }

        // Tablas rehegua
        switch (currentPage) {
            case 'users':
                return <UserTable />;
            case 'community':
                // Comunidád Tenda
                return <>{filterPostId ? <CommentTable /> : <PostTable />}</>;
            case 'reports':
                return <ReportTable />;
            case 'companies':
                return (
                    <>
                        <CompanyTable />
                        {/* Modal oñembojoapýva */}
                        <AddCompanyModal
                            show={showAddCompanyModal}
                            onClose={() => setShowAddCompanyModal(false)}
                            onSave={handleAddNewCompany} // Oñembojopyru pe apopyrã ipahaguéva
                        />
                    </>
                );
            default:
                return <UserTable />;
        }
    };

    const getTitle = () => {
        if (selectedPost) {
            return "게시글 상세보기"; // Título específico para el detalle
        }
        switch (currentPage) {
            case 'users':
                return '사용자 관리';
            case 'community':
                return '커뮤니티 관리';
            case 'reports':
                return '신고 관리';
            case 'companies':
                return '업체 관리';
            default:
                return '관리자 대시보드';
        }
    };

    return (
        // Oparupi oñembohekokatu
        <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900">
            {/* Ñe'ẽmbyry */}
            <div className="w-64 flex-shrink-0 hidden md:block">
                <Sidebar />
            </div>

            {/* Mba'ekuaarã tenondegua */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={getTitle()} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 space-y-8">
                    {renderContent()}
                </main>
                <footer className="p-4 border-t bg-white text-center text-xs text-gray-500 shadow-inner">
                    &copy; 2025 BARO GREEN Admin System. 모든 권리 보유.
                </footer>
            </div>
        </div>
    );
};

export default AdminDashboard;
